import React, { useState, useEffect, useRef, useContext } from "react";
import { CheckCircle, Loader } from "lucide-react";
import { ToastContext } from "./Context/ToastProvider.jsx";
const useToast = () => useContext(ToastContext);
const PaymentForm = ({ onClose, setPaymentStatus }) => {
  const { showSuccess } = useToast();
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [tranId, setTranId] = useState(null);
  const fetchedRef = useRef(false);
  const intervalRef = useRef(null);
  const alertedRef = useRef(false);
  const fetchQR = async () => {
    setLoading(true);
    const data = {
      req_time: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
      merchant_id: "ec462554",
      tran_id: Date.now().toString(),
      first_name: "Lang",
      last_name: "Makara",
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
      const res = await fetch("http://127.0.0.1:8000/api/payment/generate-qr", {
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
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchQR();
    }
  }, []);

useEffect(() => {
  if (!tranId) return;

  const es = new EventSource(`http://127.0.0.1:8000/api/payment/stream/${tranId}`);

  es.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'PAID') {
      setStatus('PAID');              // Update internal status
      showSuccess('Payment successful!'); 
      setPaymentStatus('PAID');       // Notify parent
      onClose?.();                    // Auto-close modal
    }
  };

  es.onerror = () => {
    es.close(); // Close SSE on error
  };

  return () => es.close();
}, [tranId, setPaymentStatus, showSuccess, onClose]);




  useEffect(() => {
    if (status === "PAID") {
      const timer = setTimeout(() => onClose?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  const handleDownloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "ABA_QR_Code.png";
    link.click();
  };

  return (
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
      <div className="bg-[#005788] p-4 text-center">
        <h2 className="text-xl font-bold text-white">ABA PAY</h2>
        <p className="text-blue-200 text-sm">Scan to pay registration fee</p>
      </div>
      <p className="text-xs mt-2 text-gray-400">tran_id: {tranId}</p>

      <div className="p-8 flex flex-col items-center">
        {loading ? (
          <Loader className="animate-spin text-blue-600" size={48} />
        ) : (
          qrImage && <img src={qrImage} alt="ABA QR Code" className="w-[200px] h-[200px] object-contain rounded" />
        )}

        <div className={`mt-6 flex items-center gap-2 font-bold text-lg ${status === "PAID" ? "text-green-600" : "text-gray-500"}`}>
          {status === "PAID" ? (
            <>
              <CheckCircle size={24} />
              <span>Payment Completed</span>
            </>
          ) : (
            <span className="animate-pulse">Waiting for payment...</span>
          )}
        </div>

        <div className="flex gap-3 mt-6 w-full">
          <button onClick={onClose} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium">
            Cancel
          </button>
          {qrImage && (
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
