// PaymentForm.jsx (FULL NO CUT)
// ✅ Payment plan (YEAR or SEMESTER) + amount calculation already done in Registration.jsx
// ✅ Same endpoints: generatePaymentQR, checkPaymentStatus

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, Loader, CloudOff, Info, Download, X } from "lucide-react";
import { generatePaymentQR, checkPaymentStatus } from "../../api/registration_api";

const PaymentForm = ({
  registrationId,
  registrationData,
  onClose,
  onSuccess,

  // ✅ new props
  yearFee = 0,
  amount = 0, // amount to pay now
  payPlan = { type: "YEAR", semester: 1 }, // {type:"YEAR"|"SEMESTER", semester:1|2}
}) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [tranId, setTranId] = useState(null);
  const [error, setError] = useState(null);

  const fetchedRef = useRef(false);
  const pollingIntervalRef = useRef(null);

  const planType = payPlan?.type || "YEAR";
  const planSemester = planType === "SEMESTER" ? Number(payPlan?.semester || 1) : 1;

  // Generate QR code
  const fetchQR = async () => {
    if (!registrationId) {
      setError("Registration ID is required");
      console.error("No registration ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("=== QR GENERATION DEBUG ===");
      console.log("Registration ID:", registrationId);
      console.log("PayPlan:", payPlan);
      console.log("Year Fee:", yearFee);
      console.log("Pay Amount:", amount);
      console.log("==========================");

      // ✅ Same endpoint call, send extra fields (backend should use `amount`)
      const response = await generatePaymentQR(registrationId, {
        pay_plan: planType, // "YEAR" or "SEMESTER"
        semester: planSemester, // 1 or 2 (for YEAR still set 1 to be safe)
        amount: Number(amount || 0),
      });

      const data = response.data;

      console.log("PayWay API Response:", data);

      const { tran_id, qr } = data;

      if (!qr || qr.status?.code !== "0" || !qr.qrImage || !tran_id) {
        console.error("Invalid PayWay response shape:", data);
        throw new Error("Invalid PayWay response");
      }

      setQrImage(qr.qrImage);
      setTranId(tran_id);

      console.log("✅ QR Code loaded successfully");
    } catch (err) {
      console.error("Error generating QR:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to generate QR code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current && registrationId) {
      fetchedRef.current = true;
      fetchQR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationId]);

  // Poll payment status
  useEffect(() => {
    if (!tranId) return;

    console.log("Starting payment status polling for:", tranId);

    const pollStatus = async () => {
      try {
        const response = await checkPaymentStatus(tranId);
        const data = response.data;

        const statusMsg = (data.status?.message || "PENDING").toUpperCase();
        setStatus(statusMsg);

        if (statusMsg === "PAID") {
          console.log("✅ Payment completed successfully!");
          clearInterval(pollingIntervalRef.current);

          setTimeout(() => {
            onSuccess?.();
          }, 1000);
        } else if (statusMsg === "FAILED" || statusMsg === "CANCELED") {
          console.log("❌ Payment failed or canceled");
          clearInterval(pollingIntervalRef.current);
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    };

    pollStatus();
    pollingIntervalRef.current = setInterval(pollStatus, 3000);

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
    link.download = `ABA_Payment_QR_${tranId}.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFinalStatus =
    status === "PAID" ||
    status === "SUCCESS" ||
    status === "FAILED" ||
    status === "CANCELED";

  const displayStudentName =
    registrationData?.data?.full_name_en ||
    `${registrationData?.data?.first_name || ""} ${registrationData?.data?.last_name || ""}`.trim();

  const planLabel = planType === "SEMESTER" ? `Semester ${planSemester} (50%)` : "Full Year (100%)";

  return (
    <div className="relative z-50 w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-white/60 overflow-hidden mx-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-white/60 p-2 rounded-full hover:bg-white/80 transition-all duration-300 border border-white/40"
        disabled={status === "PAID" || status === "SUCCESS"}
      >
        <X size={20} className="text-gray-600" />
      </button>

      <div className="relative backdrop-blur-xl bg-gradient-to-r from-[#005788] to-[#0077b6] p-6 text-center border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <h2 className="relative text-2xl font-bold text-white drop-shadow-lg">ABA PAY</h2>
        <p className="relative text-blue-100 text-sm mt-1 font-medium">
          Scan to complete payment
        </p>
      </div>

      <div className="backdrop-blur-xl bg-white/40 border-b border-white/30 px-4 py-3 space-y-1">
        {registrationData && (
          <>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Student:</span> {displayStudentName || "—"}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Student Code:</span>{" "}
              {registrationData.student_account?.student_code || registrationData.data?.student_code || "Pending"}
            </p>
          </>
        )}

        <p className="text-xs text-gray-600">
          <span className="font-medium">Plan:</span> {planLabel}
        </p>

        <p className="text-xs text-gray-600">
          <span className="font-medium">Pay Now:</span>
          <span className="text-lg font-bold text-green-600 ml-2">
            ${Number(amount || 0).toFixed(2)}
          </span>
        </p>

        <p className="text-[11px] text-gray-500">
          Year Fee: ${Number(yearFee || 0).toFixed(2)}
        </p>

        {tranId && <p className="text-xs text-gray-500 font-mono">Transaction: {tranId}</p>}
      </div>

      <div className="p-8 flex flex-col items-center">
        {error && (
          <div className="backdrop-blur-xl bg-red-50/90 border-2 border-red-200/60 text-red-700 px-4 py-3 rounded-2xl relative w-full mb-6 flex items-center gap-3 shadow-lg">
            <div className="backdrop-blur-xl bg-red-500/10 p-2 rounded-lg">
              <CloudOff size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <span className="block text-sm font-medium">{error}</span>
              <button onClick={fetchQR} className="text-xs text-red-600 hover:text-red-800 underline mt-1">
                Retry
              </button>
            </div>
          </div>
        )}

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
              crossOrigin="anonymous"
            />
          )}
        </div>

        <div
          className={`backdrop-blur-xl px-6 py-3 rounded-2xl border-2 shadow-lg w-full ${
            status === "PAID" || status === "SUCCESS"
              ? "bg-green-50/80 border-green-200/60"
              : status === "FAILED" || status === "CANCELED"
              ? "bg-red-50/80 border-red-200/60"
              : "bg-blue-50/80 border-blue-200/60"
          }`}
        >
          <div
            className={`flex items-center justify-center gap-3 font-bold text-lg ${
              status === "PAID" || status === "SUCCESS"
                ? "text-green-600"
                : status === "FAILED" || status === "CANCELED"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
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

        <div className="flex gap-3 mt-6 w-full">
          {qrImage && status === "PENDING" && (
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
            className={`relative ${
              qrImage && status === "PENDING" ? "flex-1" : "w-full"
            } py-3 px-4 rounded-xl backdrop-blur-xl text-white hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg border border-white/30 overflow-hidden group ${
              status === "PAID" || status === "SUCCESS"
                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                : "bg-gradient-to-r from-gray-600 to-gray-700"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">
              {status === "PAID" || status === "SUCCESS" ? "Complete" : "Cancel"}
            </span>
          </button>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default PaymentForm;
