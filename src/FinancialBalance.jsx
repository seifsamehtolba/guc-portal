import { useState, useEffect } from "react";
import axios from "axios";
import LoadingBar from "./LoadingBar"; // Import the LoadingBar component

export default function FinancialBalance({ user }) {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get("http://161.35.203.118/payment_details", {
          params: { username: user.username, password: user.password },
        });
        setPaymentDetails(response.data);
      } catch (err) {
        setError("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [user]);

  if (loading) return <LoadingBar />;  // Show the loading bar while loading

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Financial Balance</h2>
      <div className="space-y-4">
        {paymentDetails && paymentDetails["Payment Requests"].map((payment, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{payment["Payment Description"]}</h3>
            <p><strong>Reference:</strong> {payment.Reference}</p>
            <p><strong>Amount:</strong> {payment.Amount} {payment.Currency}</p>
            <p><strong>Due Date:</strong> {payment["Due Date"]}</p>
            <a
              href={payment["Payment Link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Pay Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
