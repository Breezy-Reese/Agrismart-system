import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceipt = async (order, buyerEmail) => {
  const receiptHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { margin: 20px 0; }
        .order-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        .products { margin: 20px 0; }
        .product-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
        .footer { margin-top: 30px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AgriSmart Payment Receipt</h1>
      </div>

      <div class="content">
        <div class="order-details">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        </div>

        <div class="products">
          <h2>Products Purchased</h2>
          ${order.products.map(item => `
            <div class="product-item">
              <strong>${item.product.name}</strong><br>
              Quantity: ${item.quantity} | Unit Price: KES ${item.price} | Subtotal: KES ${(item.quantity * item.price).toFixed(2)}
            </div>
          `).join('')}
        </div>

        <div class="total">
          <p>Total Amount: KES ${order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for shopping with AgriSmart!</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: buyerEmail,
    subject: 'Your AgriSmart Payment Receipt',
    html: receiptHtml,
  };

  await transporter.sendMail(mailOptions);
};
