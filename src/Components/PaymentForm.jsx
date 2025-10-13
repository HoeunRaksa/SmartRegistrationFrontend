import React, { useState, useEffect } from "react";
import { showSuccess, showError, ToastContainer } from "./ui/Toast.jsx";
const PaymentForm = ({ onClose, formData }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PENDING"); // PENDING / PAID
  const [tranId, setTranId] = useState(null); // ABA transaction ID
  const [alerted, setAlerted] = useState(false); // show alert only once
  const fetchedRef = React.useRef(false);
  const fetchQR = async () => {
    setLoading(true);
    const data = {
      req_time: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
      merchant_id: "ec461971",
      tran_id: Date.now().toString(),
      first_name: "Hoeun",
      last_name: "Raksa",
      email: "aba.bank@gmail.com",
      phone: "012345678",
      amount: 0.1,
      purchase_type: "purchase",
      payment_option: "abapay_khqr",
      items: "W3sibmFtZSI6IkZ1bGwgdGVzdCBpdGVtIiwicXVhbnRpdHkiOjEsInByaWNlIjoxMDB9XQ==",
      currency: "USD",
      callback_url: "aHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjaw==",
      lifetime: 6,
      qr_image_template: "template3_color",
    };

   try {
  const res = await fetch("https://localhost:7247/api/payment/generate-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  console.log("ABA QR response:", json);

  setQrImage(json.qr_image_url || json.qrImage || json.qr_code || null);
if (json.tran_id) setTranId(json.tran_id);

} catch (err) {
  console.error("Error fetching QR:", err);
  setQrImage("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ERROR");
} finally {
  setLoading(false);
}
  };

useEffect(() => {
  if (fetchedRef.current) return; // already fetched
  fetchedRef.current = true;
  fetchQR();
}, []);

  useEffect(() => {
    if (!tranId) return;

    const evtSource = new EventSource(`https://localhost:7247/api/payment/stream-status/${tranId}`);

    evtSource.onmessage = (event) => {
      console.log("SSE Status:", event.data);
      setStatus(event.data);
    };
    evtSource.addEventListener("complete", (event) => {
  console.log("Payment complete:", event.data);
  evtSource.close();
});


    evtSource.onerror = (err) => {
      console.error("SSE Error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [tranId]);

  useEffect(() => {
    if (status === "PAID" && !alerted) {
      setAlerted(true);
      showSuccess("Payment successful! Thank you.", "w-200");
    }
  }, [status, alerted]);
  useEffect(() => {
    if (alerted == true) {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [alerted]);

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md border border-gray-200 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">ABA Payment QR</h2>

      {loading && <p className="text-gray-500 mb-4">Generating QR code...</p>}

      {qrImage && (
        <img
          src={qrImage}
          alt="ABA QR Code"
          className="mx-auto w-200 h-full object-contain rounded-lg shadow-sm"
        />
      )}

      <p className={`mt-4 font-bold text-lg ${status === "PAID" ? "text-green-600" : "text-gray-600"}`}>
        {status === "PAID" ? "Payment Completed ✅" : "Waiting for payment..."}
      </p>
        <button className="mt-4 text-gray-500 underline" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default PaymentForm;
