import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    currency: "KHR",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://localhost:7247/api/Payments/purchase", formData);
      console.log("Server response:", response.data);
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        alert("Failed to get checkout URL. Check console for details.");
      }
    } catch (error) {
      console.error("Payment request failed:", error.response || error);
      alert("Payment request failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border border-gray-300 rounded p-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500";

  return (
    <section className="min-h-screen flex justify-center items-start py-10 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          ABA <span className="text-orange-500">PayWay</span> Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PaymentForm;
