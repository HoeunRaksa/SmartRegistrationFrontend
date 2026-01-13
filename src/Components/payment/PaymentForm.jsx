import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Loader, CloudOff, Info, Download, X } from "lucide-react";
import { generatePaymentQR, checkPaymentStatus } from "../../api/payment_api";
import QRCode from "qrcode";
const PaymentForm = ({
  registrationId,
  amount,
  registrationData,
  onClose,
  onSuccess
}) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [tranId, setTranId] = useState(null);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  const pollingIntervalRef = useRef(null);

  // Generate QR code when component mounts
const fetchQR = async () => {
  if (!registrationId) {
    setError("Registration ID is required");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await generatePaymentQR(registrationId);
    const data = response.data;

    console.log("PayWay response:", data);

    // ✅ PayWay returns qr_string
    if (!data.qr_string) {
      throw new Error("qr_string not returned from PayWay");
    }

    // ✅ Convert qr_string → QR IMAGE
    const qrImageUrl = await QRCode.toDataURL(data.qr_string, {
      width: 300,
      margin: 1,
    });

    setQrImage(qrImageUrl);
    setTranId(data.tran_id);

  } catch (err) {
    console.error(err);
    setError(err.message || "Failed to generate QR");
  } finally {
    setLoading(false);
  }
};


  // Initial QR generation
  useEffect(() => {
    if (!fetchedRef.current && registrationId) {
      fetchedRef.current = true;
      fetchQR();
    }
  }, [registrationId]);

  // Poll payment status
  useEffect(() => {
    if (!tranId) return;

    console.log('Starting payment status polling for:', tranId);

    const pollStatus = async () => {
      try {
        const response = await checkPaymentStatus(tranId);
        const data = response.data;

        const statusMsg = data.status?.message || data.status || 'PENDING';
        console.log('Payment status:', statusMsg);

        setStatus(statusMsg);

        // Check if payment is complete
        if (statusMsg === "PAID" || statusMsg.toUpperCase() === "SUCCESS") {
          console.log('Payment completed successfully!');
          clearInterval(pollingIntervalRef.current);

          // Wait a moment before calling success callback
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
          }, 1000);

        } else if (statusMsg === "FAILED" || statusMsg === "CANCELED") {
          console.log('Payment failed or canceled');
          clearInterval(pollingIntervalRef.current);
        }

      } catch (err) {
        console.error("Error polling status:", err);
        // Don't stop polling on error, might be temporary network issue
      }
    };

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(pollStatus, 3000);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [tranId, onSuccess]);

  const handleDownloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `ABA_QR_Payment_${tranId}.png`;
    link.click();
  };

  const isFinalStatus = status === "PAID" || status === "SUCCESS" || status === "FAILED" || status === "CANCELED";

  return (
    <div className="relative w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-white/60 overflow-hidden mx-4">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-white/60 p-2 rounded-full hover:bg-white/80 transition-all duration-300 border border-white/40"
        disabled={status === 'PAID' || status === 'SUCCESS'}
      >
        <X size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-[#005788] to-[#0077b6] p-6 text-center border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <h2 className="relative text-2xl font-bold text-white drop-shadow-lg">ABA PAY</h2>
        <p className="relative text-blue-100 text-sm mt-1 font-medium">Scan to complete registration payment</p>
      </div>

      {/* Registration Details */}
      <div className="backdrop-blur-xl bg-white/40 border-b border-white/30 px-4 py-3 space-y-1">
        {registrationData && (
          <>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Student:</span> {registrationData.data?.full_name_en || `${registrationData.data?.first_name} ${registrationData.data?.last_name}`}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Student Code:</span> {registrationData.student_account?.student_code || 'Pending'}
            </p>
          </>
        )}
        <p className="text-xs text-gray-600">
          <span className="font-medium">Amount:</span>
          <span className="text-lg font-bold text-green-600 ml-2">${amount ? parseFloat(amount).toFixed(2) : '0.00'}</span>
        </p>
        {tranId && (
          <p className="text-xs text-gray-500 font-mono">
            Transaction: {tranId}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col items-center">
        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-xl bg-red-50/90 border-2 border-red-200/60 text-red-700 px-4 py-3 rounded-2xl relative w-full mb-6 flex items-center gap-3 shadow-lg" role="alert">
            <div className="backdrop-blur-xl bg-red-500/10 p-2 rounded-lg">
              <CloudOff size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <span className="block text-sm font-medium">{error}</span>
              <button
                onClick={fetchQR}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* QR Code Container */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 p-6 rounded-3xl border-2 border-white/60 shadow-xl mb-6">
          {loading || !qrImage ? (
            <div className="w-[240px] h-[240px] flex items-center justify-center backdrop-blur-xl bg-white/40 border-2 border-white/50 rounded-2xl">
              {loading ? (
                <div className="text-center">
                  <Loader className="animate-spin text-blue-600 mb-3 mx-auto" size={48} />
                  <p className="text-sm text-gray-600 font-medium">Generating QR Code...</p>
                  <p className="text-xs text-gray-500 mt-1">Please wait</p>
                </div>
              ) : (
                <div className="text-center">
                  <Info className="text-gray-400 mb-2 mx-auto" size={48} />
                  <p className="text-sm text-gray-600">No QR Code</p>
                </div>
              )}
            </div>
          ) : (
            <img
              src={qrImage}
              alt="ABA Payment QR Code"
              className="w-[240px] h-[240px] object-contain rounded-2xl shadow-lg"
            />
          )}
        </div>

        {/* Status Display */}
        <div className={`backdrop-blur-xl px-6 py-3 rounded-2xl border-2 shadow-lg w-full
            ${status === "PAID" || status === "SUCCESS"
            ? "bg-green-50/80 border-green-200/60"
            : status === "FAILED" || status === "CANCELED"
              ? "bg-red-50/80 border-red-200/60"
              : "bg-blue-50/80 border-blue-200/60"}`}>
          <div className={`flex items-center justify-center gap-3 font-bold text-lg 
              ${status === "PAID" || status === "SUCCESS"
              ? "text-green-600"
              : status === "FAILED" || status === "CANCELED"
                ? "text-red-600"
                : "text-blue-600"}`}>
            {status === "PAID" || status === "SUCCESS" ? (
              <>
                <div className="backdrop-blur-xl bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <span>Payment Completed!</span>
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

        {/* Instructions */}
        {!isFinalStatus && qrImage && (
          <div className="mt-6 backdrop-blur-xl bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 w-full">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">How to Pay:</h4>
            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
              <li>Open ABA Mobile app</li>
              <li>Tap "Scan QR" on the home screen</li>
              <li>Scan this QR code</li>
              <li>Confirm the payment</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 w-full">
          {qrImage && status === 'PENDING' && (
            <button
              onClick={handleDownloadQR}
              className="relative flex-1 py-3 px-4 rounded-xl backdrop-blur-xl bg-white/60 border-2 border-white/60 text-gray-700 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg overflow-hidden group flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Download size={18} />
              <span className="relative z-10">Download</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`relative flex-1 py-3 px-4 rounded-xl backdrop-blur-xl text-white hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg border border-white/30 overflow-hidden group ${status === 'PAID' || status === 'SUCCESS'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">
              {status === 'PAID' || status === 'SUCCESS' ? 'Complete' : 'Cancel'}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default PaymentForm;