import React, { useState, useEffect, useRef, useContext } from "react";
import { CheckCircle, Loader, CloudOff, Info } from "lucide-react";
import { ToastContext } from "../Context/ToastProvider.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PaymentForm = ({ onClose, setPaymentStatus, onSuccess, initialPaymentData }) => {
  const { showSuccess, showError } = useContext(ToastContext);
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
    <div className="relative w-full max-w-sm backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-white/60 overflow-hidden mx-4">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Header */}
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-[#005788] to-[#0077b6] p-6 text-center border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <h2 className="relative text-2xl font-bold text-white drop-shadow-lg">ABA PAY</h2>
        <p className="relative text-blue-100 text-sm mt-1 font-medium">Scan to pay registration fee</p>
      </div>

      {/* Transaction ID */}
      <div className="backdrop-blur-xl bg-white/40 border-b border-white/30 px-4 py-2">
        <p className="text-xs text-gray-600 font-medium">
          Transaction ID: <span className="font-mono text-gray-800">{tranId || 'Generating...'}</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col items-center">
        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-xl bg-red-50/90 border-2 border-red-200/60 text-red-700 px-4 py-3 rounded-2xl relative w-full mb-6 flex items-center gap-3 shadow-lg" role="alert">
            <div className="backdrop-blur-xl bg-red-500/10 p-2 rounded-lg">
              <CloudOff size={18} className="text-red-600" />
            </div>
            <span className="block sm:inline font-medium">{error}</span>
          </div>
        )}

        {/* QR Code Container */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 p-6 rounded-3xl border-2 border-white/60 shadow-xl mb-6">
          {loading || !qrImage ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center backdrop-blur-xl bg-white/40 border-2 border-white/50 rounded-2xl">
              {loading ? (
                <div className="text-center">
                  <Loader className="animate-spin text-blue-600 mb-2" size={48} />
                  <p className="text-sm text-gray-600 font-medium">Loading QR...</p>
                </div>
              ) : (
                <Info className="text-gray-400" size={48} />
              )}
            </div>
          ) : (
            <img 
              src={qrImage} 
              alt="ABA QR Code" 
              className="w-[200px] h-[200px] object-contain rounded-2xl shadow-lg" 
            />
          )}
        </div>

        {/* Status Display */}
        <div className={`backdrop-blur-xl px-6 py-3 rounded-2xl border-2 shadow-lg
            ${status === "PAID" 
              ? "bg-green-50/80 border-green-200/60" 
              : status === "FAILED" || status === "CANCELED" 
              ? "bg-red-50/80 border-red-200/60" 
              : "bg-blue-50/80 border-blue-200/60"}`}>
          <div className={`flex items-center gap-3 font-bold text-lg 
              ${status === "PAID" 
                ? "text-green-600" 
                : status === "FAILED" || status === "CANCELED" 
                ? "text-red-600" 
                : "text-blue-600"}`}>
            {status === "PAID" ? (
              <>
                <div className="backdrop-blur-xl bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <span>Payment Completed</span>
              </>
            ) : isFinalStatus ? (
              <>
                <div className="backdrop-blur-xl bg-red-500/10 p-2 rounded-lg">
                  <CloudOff size={24} />
                </div>
                <span>{status}</span>
              </>
            ) : (
              <>
                <div className="backdrop-blur-xl bg-blue-500/10 p-2 rounded-lg">
                  <Loader className="animate-spin" size={24} />
                </div>
                <span className="animate-pulse">Waiting for payment...</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 w-full">
          <button
            onClick={onClose}
            className="relative flex-1 py-3 px-4 rounded-xl backdrop-blur-xl bg-white/60 border-2 border-white/60 text-gray-700 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            disabled={status === 'PAID'}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">{status === 'PAID' ? 'Done' : 'Cancel'}</span>
          </button>
          
          {qrImage && status === 'PENDING' && (
            <button
              onClick={handleDownloadQR}
              className="relative flex-1 py-3 px-4 rounded-xl backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg border border-white/30 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Download QR</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default PaymentForm;