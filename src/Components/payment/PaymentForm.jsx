// ==============================
// PaymentForm.jsx (FULL NO CUT)
// ✅ Supports Pay Plan: SEMESTER (50%) or YEAR (100%)
// ✅ Sends correct payload to backend (pay_plan as OBJECT + registration_id)
// ✅ Polls payment status and calls onSuccess when PAID
// ✅ Prevents duplicate polling timers
// ==============================
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, CheckCircle, AlertTriangle, RefreshCw, Clock, DollarSign } from "lucide-react";
import { generatePaymentQR, checkPaymentStatus } from "../../api/registration_api.jsx";

const normalizeStatus = (raw) => String(raw || "").trim().toUpperCase();
const isPaidStatus = (raw) => ["PAID", "COMPLETED", "SUCCESS", "APPROVED"].includes(normalizeStatus(raw));

const clampSemester = (s) => {
  const n = parseInt(s, 10);
  return n === 2 ? 2 : 1;
};

const calcAmount = ({ yearFee, payPlan }) => {
  const fee = Number(yearFee) || 0;
  if (!payPlan || payPlan.type === "YEAR") return fee;
  return Math.round(fee * 0.5 * 100) / 100;
};

const pickQrFromResponse = (data) => {
  const d = data?.data || data || {};

  const qrImage =
    d.qr_image ||
    d.qrImage ||
    d.qr_url ||
    d.qrUrl ||
    d.qr_code_url ||
    d.qrCodeUrl ||
    (d.qr && (d.qr.qr_image || d.qr.qrImage || d.qr.qr_url || d.qr.qrUrl)) ||
    null;

  const qrString =
    d.qr_string ||
    d.qrString ||
    d.qr ||
    d.qr_code ||
    d.qrCode ||
    (d.qr && (d.qr.qr_string || d.qr.qrString || d.qr.qr_code || d.qr.qrCode)) ||
    null;

  const tranId =
    d.tran_id ||
    d.tranId ||
    d.tranID ||
    d.transaction_id ||
    d.transactionId ||
    d.payment_tran_id ||
    (d.qr && (d.qr.tran_id || d.qr.tranId || d.qr.transaction_id)) ||
    null;

  return { qrImage, qrString, tranId, raw: d };
};

const PaymentForm = ({
  registrationId,
  yearFee = 0,
  payPlan: payPlanProp,
  amount: amountProp,
  registrationData,
  onClose,
  onSuccess,
}) => {
  const [payPlan, setPayPlan] = useState(() => {
    if (payPlanProp?.type) {
      return {
        type: payPlanProp.type === "SEMESTER" ? "SEMESTER" : "YEAR",
        semester: clampSemester(payPlanProp.semester ?? 1),
      };
    }
    return { type: "SEMESTER", semester: 1 };
  });

  const computedAmount = useMemo(() => {
    if (amountProp != null && Number(amountProp) > 0) return Number(amountProp);
    return calcAmount({ yearFee, payPlan });
  }, [amountProp, yearFee, payPlan]);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [qrImage, setQrImage] = useState(null);
  const [qrString, setQrString] = useState(null);
  const [tranId, setTranId] = useState(null);

  const [status, setStatus] = useState("PENDING");
  const [statusMsg, setStatusMsg] = useState("");
  const [polling, setPolling] = useState(false);

  const aliveRef = useRef(true);
  const pollTimerRef = useRef(null);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setPolling(false);
  };

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ backend expects registration_id + pay_plan object
  const buildPayload = () => {
    const planType = payPlan?.type === "SEMESTER" ? "SEMESTER" : "YEAR";
    const sem = clampSemester(payPlan?.semester ?? 1);

    return {
      registration_id: Number(registrationId), // ✅ REQUIRED by Laravel validation
      pay_plan: {
        type: planType,
        semester: planType === "SEMESTER" ? sem : 1,
      },
      semester: planType === "SEMESTER" ? sem : 1, // your backend validates this too
      amount: computedAmount, // optional
    };
  };

  const startPolling = (tranIdValue) => {
    if (!tranIdValue) return;

    stopPolling();
    setPolling(true);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(tranIdValue);
        const d = res?.data?.data || res?.data || {};

        const st =
          d.payment_status ||
          d.status ||
          d.tran_status ||
          d.tranStatus ||
          d.ack ||
          "PENDING";

        const msg = d.message || d.description || "";

        if (!aliveRef.current) return;
        setStatus(normalizeStatus(st) || "PENDING");
        setStatusMsg(String(msg || ""));

        if (isPaidStatus(st)) {
          stopPolling();

          onSuccess?.({
            registrationId,
            tranId: tranIdValue,
            status: st,
            payPlan,
            amount: computedAmount,
            registrationData,
          });
        }
      } catch (e) {
        // keep polling
      }
    }, 2500);
  };

  const generateQrNow = async () => {
    if (!registrationId) {
      setError("Missing registration id");
      return;
    }

    setError(null);
    setGenerating(true);
    setLoading(true);

    // ✅ prevent old polling + old status while generating new QR
    stopPolling();
    setStatus("PENDING");
    setStatusMsg("");
    setQrImage(null);
    setQrString(null);
    setTranId(null);

    try {
      const payload = buildPayload();

      // generatePaymentQR should POST to backend generateQr
      // It can ignore registrationId param if it already uses payload.registration_id
      const res = await generatePaymentQR(registrationId, payload);

      const { qrImage, qrString, tranId } = pickQrFromResponse(res?.data);
      if (!aliveRef.current) return;

      setQrImage(qrImage);
      setQrString(qrString);
      setTranId(tranId);

      if (tranId) startPolling(tranId);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        (e.response?.data?.errors ? JSON.stringify(e.response.data.errors) : null) ||
        e.response?.data?.error ||
        e.message ||
        "Failed to generate QR";

      if (!aliveRef.current) return;
      setError(msg);
    } finally {
      if (!aliveRef.current) return;
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQrNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusUI = useMemo(() => {
    const s = normalizeStatus(status);
    if (isPaidStatus(s)) {
      return {
        label: "PAID",
        cls: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      };
    }
    return {
      label: "PENDING",
      cls: "bg-orange-100 text-orange-700 border-orange-200",
      icon: Clock,
    };
  }, [status]);

  const StatusIcon = statusUI.icon;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full max-w-lg">
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/60 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              stopPolling();
              onClose?.();
            }}
            className="absolute top-4 right-4 backdrop-blur-xl bg-white/60 p-2 rounded-full hover:bg-white/80 transition-all duration-300 border border-white/40"
          >
            <X size={20} className="text-gray-600" />
          </motion.button>

          <div className="p-6">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-3 shadow-xl">
                {loading ? <Loader className="animate-spin text-white" size={28} /> : <DollarSign className="text-white" size={28} />}
              </div>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Payment (QR)
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Choose to pay <b>one semester (50%)</b> or <b>full year (100%)</b>.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-white/60 rounded-2xl p-4 shadow-sm mb-4">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setPayPlan((p) => ({ ...p, type: "SEMESTER" }))}
                  className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-all border ${
                    payPlan.type === "SEMESTER"
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-white/30 shadow-lg"
                      : "bg-white/60 text-gray-800 border-white/60 hover:bg-white/80"
                  }`}
                  disabled={generating}
                >
                  Pay Semester (50%)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setPayPlan((p) => ({ ...p, type: "YEAR" }))}
                  className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-all border ${
                    payPlan.type === "YEAR"
                      ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white border-white/30 shadow-lg"
                      : "bg-white/60 text-gray-800 border-white/60 hover:bg-white/80"
                  }`}
                  disabled={generating}
                >
                  Pay Full Year (100%)
                </motion.button>
              </div>

              {payPlan.type === "SEMESTER" && (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-700 font-medium">Select Semester</div>
                  <select
                    value={String(payPlan.semester)}
                    onChange={(e) => setPayPlan((p) => ({ ...p, semester: clampSemester(e.target.value) }))}
                    className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    disabled={generating}
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Year Fee: <span className="font-semibold text-gray-800">${Number(yearFee || 0).toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Pay Now:{" "}
                  <span className="text-xl font-extrabold text-green-600">
                    ${Number(computedAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={generateQrNow}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 overflow-hidden group"
                >
                  <motion.div
                    animate={generating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    {generating ? <Loader size={16} /> : <RefreshCw size={16} />}
                  </motion.div>
                  Generate QR
                </motion.button>
              </div>
            </div>

            {error && (
              <div className="mb-4 backdrop-blur-xl bg-red-50/70 border border-red-200/60 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-600 mt-0.5" size={18} />
                <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
              </div>
            )}

            <motion.div
              animate={polling ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusUI.cls}`}
            >
              <motion.div
                animate={polling ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <StatusIcon size={14} />
              </motion.div>
              {statusUI.label}
              {polling ? <span className="opacity-70">• checking...</span> : null}
            </motion.div>

            {statusMsg ? <div className="text-xs text-gray-500 mb-4">{statusMsg}</div> : null}

            <div className="backdrop-blur-xl bg-white/60 border border-white/60 rounded-2xl p-4 shadow-sm">
              {!qrImage && !qrString ? (
                <div className="py-10 text-center text-gray-600">
                  {loading ? (
                    <div className="inline-flex items-center gap-2">
                      <Loader className="animate-spin" size={18} />
                      Generating QR...
                    </div>
                  ) : (
                    "QR not available"
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt="QR"
                      className="w-64 h-64 object-contain rounded-2xl bg-white p-3 shadow"
                      onError={() => setQrImage(null)}
                    />
                  ) : null}

                  {qrString ? (
                    <div className="w-full mt-3">
                      <div className="text-xs text-gray-500 mb-1">QR String (copy if needed)</div>
                      <textarea
                        value={qrString}
                        readOnly
                        rows={4}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white/70 outline-none"
                      />
                    </div>
                  ) : null}

                  {tranId ? (
                    <div className="mt-3 text-xs text-gray-500">
                      Tran ID: <span className="font-semibold text-gray-700">{tranId}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="mt-5 text-xs text-gray-500">
              Scan with ABA Mobile. After payment, status will update automatically.
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentForm;
