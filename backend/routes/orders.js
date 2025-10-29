import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { sendReceipt } from "../utils/email.js";

const router = express.Router();

/**
 * @desc Create a new order
 * @route POST /api/orders
 * @access Private
 */
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  try {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((item) => item.product) },
    });

    const itemsPrice = itemsFromDB.reduce((acc, item) => {
      const orderItem = orderItems.find(
        (o) => o.product === item._id.toString()
      );
      return acc + item.price * orderItem.quantity;
    }, 0);

    const order = await Order.create({
      buyer: req.user._id,
      products: orderItems,
      totalAmount: itemsPrice,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Initiate M-Pesa STK Push Payment
 * @route POST /api/orders/initiate-mpesa-payment
 * @access Private
 */
router.post("/initiate-mpesa-payment", protect, async (req, res) => {
  const { amount, phoneNumber, orderId } = req.body;

  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error("Missing M-Pesa credentials in .env file");
    }

    console.log("🔑 Consumer Key:", consumerKey);
    console.log("🕵️‍♂️ Consumer Secret:", consumerSecret);

    // Generate base64 encoded credentials
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // Get OAuth token
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log("✅ Access Token received:", accessToken);

    // Generate timestamp: YYYYMMDDHHMMSS
    const date = new Date();
    const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
      date.getDate()
    ).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}${String(
      date.getMinutes()
    ).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

    // Generate password
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    console.log("🕒 Timestamp:", timestamp);
    console.log("🔐 Password generated:", password.substring(0, 15) + "...");

    // Send STK push request
    const stkPushResponse = await axios.post(
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
  {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: phoneNumber,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: `${process.env.BASE_URL}/api/orders/mpesa-callback`,
    AccountReference: `Agrismart Order-${orderId}`, // <-- custom name
    TransactionDesc: `Payment for Agrismart order #${orderId}`, // <-- custom description
  },
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
);

    res.json({
      message: "STK Push initiated successfully",
      response: stkPushResponse.data,
    });
  } catch (error) {
    console.error("❌ M-Pesa STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to initiate M-Pesa payment" });
  }
});

/**
 * @desc Handle M-Pesa Callback
 * @route POST /api/orders/mpesa-callback
 * @access Public
 */
router.post("/mpesa-callback", async (req, res) => {
  console.log("📩 M-Pesa callback received:", JSON.stringify(req.body, null, 2));

  const { Body } = req.body || {};

  try {
    if (!Body?.stkCallback) {
      console.warn("⚠️ Invalid callback format:", req.body);
      return res.status(400).json({ message: "Invalid callback format" });
    }

    const callback = Body.stkCallback;

    if (callback.ResultCode === 0) {
      const accountItem = callback.CallbackMetadata?.Item?.find(
        (i) => i.Name === "AccountReference"
      );
      const accountReference = accountItem?.Value || "";
      const orderId = accountReference.replace("Order-", "").trim();

      const order = await Order.findById(orderId).populate("buyer", "email");

      if (order) {
        order.status = "confirmed";
        order.paymentIntentId = callback.CheckoutRequestID;
        await order.save();

        try {
          await sendReceipt(order, order.buyer.email);
        } catch (emailError) {
          console.error("Receipt email error:", emailError);
        }
      } else {
        console.warn("⚠️ Order not found for callback:", orderId);
      }
    } else {
      console.warn("M-Pesa transaction failed:", callback.ResultDesc);
    }

    res.json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback processing error:", error);
    res.status(500).json({ message: "Callback processing failed" });
  }
});

export default router;
