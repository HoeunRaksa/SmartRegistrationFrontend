import React, { useState, useEffect, useRef, useContext } from "react";
import { CheckCircle, Loader, CloudOff, Info } from "lucide-react";
import { ToastContext } from "../Context/ToastProvider.jsx";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const PaymentForm = ({ onClose, setPaymentStatus, onSuccess, initialPaymentData }) => {
  const { showSuccess, showError } = useContext(ToastContext)
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [tranId, setTranId] = useState(null);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  const fetchQR = async () => {
    setLoading(true);
    setError(null);
    const data = initialPaymentData || {
      req_time: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
      merchant_id: "ec463261",
      tran_id: Date.now().toString(),
      first_name: "Hoeun",
      last_name: "Raksa",
      email: "hoeunraksa12@gmail.com",
      phone: "0979899100",
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
      const res = await fetch(`${API_BASE_URL}/api/payment/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let errorJson;
        try {
          errorJson = await res.json();
        } catch {
          const text = await res.text();
          throw new Error("Backend did not return JSON: " + text);
        }
        throw new Error(errorJson.message || `API Error: ${res.status}`);
      }

      const json = await res.json();

      const imageUrl = json.qr_image_url || json.qrImage || json.qr_code;
      if (!imageUrl) throw new Error("QR image URL not returned");

      setQrImage(imageUrl);
      setTranId(json.tran_id);
    } catch (err) {
      console.error("Error fetching QR:", err);
      setError(err.message);
      showError(err.message || "Payment initiation failed.");
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

    let interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/check-status/${tranId}`);
        if (!res.ok) throw new Error(`Status API error: ${res.status}`);

        const data = await res.json();
        const statusMsg = data.status?.message;
        setStatus(statusMsg);

        if (statusMsg === "PAID" || statusMsg === "FAILED") {
          clearInterval(interval);
          if (statusMsg === "PAID") {
            showSuccess("Payment successfully completed!");
            if (onSuccess) onSuccess();  // ✅ CALL THE CALLBACK HERE
          } else {
            showError(`Payment ${statusMsg.toLowerCase()}.`);
          }
          onClose?.();
        }

      } catch (err) {
        console.error("Error polling status:", err);
        showError("Failed to poll payment status.");
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tranId]);


  const handleDownloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `ABA_QR_Code_${tranId}.png`;
    link.click();
  };

  const isFinalStatus = status === "PAID" || status === "FAILED" || status === "CANCELED";

  return (
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
      <div className="bg-[#005788] p-4 text-center">
        <h2 className="text-xl font-bold text-white">ABA PAY</h2>
        <p className="text-blue-200 text-sm">Scan to pay registration fee</p>
      </div>
      <p className="text-xs mt-2 text-gray-400 p-2">Tran ID: {tranId || 'Generating...'}</p>

      <div className="p-8 flex flex-col items-center">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full mb-4 flex items-center gap-2" role="alert">
            <CloudOff size={18} />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading || !qrImage ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center border border-gray-200 rounded">
            {loading ? <Loader className="animate-spin text-blue-600" size={48} /> : <Info className="text-gray-400" size={48} />}
          </div>
        ) : (
          <img src={qrImage} alt="ABA QR Code" className="w-[200px] h-[200px] object-contain rounded" />
        )}

        <div className={`mt-6 flex items-center gap-2 font-bold text-lg 
            ${status === "PAID" ? "text-green-600" : status === "FAILED" || status === "CANCELED" ? "text-red-600" : "text-gray-500"}`}>
          {status === "PAID" ? (
            <>
              <CheckCircle size={24} />
              <span>Payment Completed</span>
            </>
          ) : isFinalStatus ? (
            <span>{status}</span>
          ) : (
            <span className="animate-pulse">Waiting for payment...</span>
          )}
        </div>

        <div className="flex gap-3 mt-6 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
            disabled={status === 'PAID'}
          >
            {status === 'PAID' ? 'Done' : 'Cancel'}
          </button>
          {qrImage && status === 'PENDING' && (
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            >
              Download QR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
