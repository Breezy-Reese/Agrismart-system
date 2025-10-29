import { useState } from 'react';
import api from '../services/api';

const PaymentForm = ({ orderId, amount, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Initiate M-Pesa payment
      await api.post('/orders/initiate-mpesa-payment', {
        amount: Math.round(amount), // M-Pesa expects integer amount
        phoneNumber,
        orderId,
      });

      // Show success message and close form
      alert('Payment initiated. Please check your phone for the M-Pesa prompt and complete the payment.');
      onSuccess();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Total Amount: <span className="font-bold">KES {amount.toFixed(2)}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (e.g., 254712345678)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your M-Pesa registered phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Initiating Payment...' : `Pay KES ${amount.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
