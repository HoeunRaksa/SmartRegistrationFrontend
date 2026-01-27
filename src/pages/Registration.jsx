// Registration.jsx (FULL NO CUT) ✅
// ✅ New flow supported:
// 1) Pre-check major quota + open/close BEFORE submit (no waste time)
// 2) Fast: cache major fee + quota result, debounce quota check
// 3) Same submit endpoint: POST /register/save (multipart/form-data)
// 4) Payment plan chosen ONLY at payment modal time (YEAR / SEMESTER)
// 5) Works with your MajorCapacityController: GET /majors/{id}/capacity?academic_year=2026-2027

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  memo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader,
  Upload,
  GraduationCap,
  User,
  Phone,
  MapPin,
  Mail,
  School,
  CreditCard,
  University,
  User2,
  Shield,
  AlertTriangle,
  DollarSign,
  Smartphone,
  CheckCircle,
  Info,
  Lock,
} from "lucide-react";

import PaymentForm from "../Components/payment/PaymentForm.jsx";
import {
  submitRegistration,
  payLater as payLaterApi,
  canRegister,
} from "../api/registration_api.jsx";
import {
  fetchDepartments,
  fetchMajorsByDepartment,
} from "../api/department_api.jsx";
import { fetchMajor } from "../api/major_api.jsx";
import API from "../api/index"; // ✅ used for major capacity endpoint

export const ToastContext = createContext();

const currentYear = new Date().getFullYear();

/**
 * ✅ Registration is for academic year (NOT for semester payment).
 * Semester selection moved to payment plan only.
 */
const DEFAULT_FORM = {
  firstName: "",
  lastName: "",
  fullNameKh: "",
  fullNameEn: "",
  gender: "Male",
  dateOfBirth: "",
  phoneNumber: "",
  personalEmail: "",

  highSchoolName: "",
  graduationYear: "",
  grade12Result: "",

  departmentId: "",
  majorId: "",
  faculty: "",
  shift: "Morning",
  batch: `${currentYear}`,
  academicYear: `${currentYear}-${currentYear + 1}`,

  profilePicture: null,
  address: "",
  currentAddress: "",

  fatherName: "",
  fathersDateOfBirth: "",
  fathersNationality: "",
  fathersJob: "",
  fathersPhoneNumber: "",

  motherName: "",
  motherDateOfBirth: "",
  motherNationality: "",
  mothersJob: "",
  motherPhoneNumber: "",

  guardianName: "",
  guardianPhoneNumber: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
};

const REQUIRED_KEYS = [
  "firstName",
  "lastName",
  "personalEmail",
  "departmentId",
  "majorId",
  "highSchoolName",
  "dateOfBirth",
  "academicYear",
];

// ✅ Cast select values to correct type
const NUMBER_FIELDS = new Set(["departmentId", "majorId"]);

const inputClassBase =
  "w-full backdrop-blur-xl bg-white/60 border-2 border-white/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium shadow-lg";
const labelClassBase = "block text-sm font-semibold text-gray-700 mb-2 ml-1";

const Field = memo(function Field({
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder,
  required,
  icon: Icon,
  options,
  disabled,
  readOnly,
  className = "",
}) {
  const isSelect = type === "select";
  const isTextarea = type === "textarea";

  return (
    <div className="relative">
      <label className={labelClassBase}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      {Icon && !isSelect && !isTextarea ? (
        <Icon className="absolute left-3 top-[55%] text-gray-500" size={18} />
      ) : null}

      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputClassBase} ${className}`}
          required={required}
          disabled={disabled}
        >
          {options?.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClassBase} ${className}`}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClassBase} ${Icon ? "!pl-10" : ""} ${className}`}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
    </div>
  );
});

const Section = memo(function Section({
  title,
  icon: Icon,
  gradientBar,
  iconGradient,
  children,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60 relative"
    >
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`absolute inset-x-0 top-0 h-1.5 ${gradientBar} rounded-t-3xl`}
        style={{ backgroundSize: "200% 100%" }}
      />
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`p-3 backdrop-blur-xl ${iconGradient} rounded-2xl text-white shadow-lg`}
        >
          <Icon size={24} />
        </motion.div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
});

/**
 * ✅ Payment Plan (NOT registration semester)
 */
const DEFAULT_PAY_PLAN = { type: "YEAR", semester: 1 }; // type: "YEAR" | "SEMESTER"

const Registration = () => {
  const [form, setForm] = useState(DEFAULT_FORM);

  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);

  // fee
  const [selectedMajorFee, setSelectedMajorFee] = useState(null);

  // ✅ major quota state (from /majors/{id}/capacity?academic_year=...)
  const [quotaInfo, setQuotaInfo] = useState({
    loading: false,
    checked: false,
    available: true,
    limited: false,
    limit: null,
    used: 0,
    remaining: null,
    message: null,
  });

  const [showQr, setShowQr] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const [payPlan, setPayPlan] = useState(DEFAULT_PAY_PLAN);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [profilePreview, setProfilePreview] = useState(null);

  // avoid state updates after unmount
  const aliveRef = useRef(true);

  // cache for speed (fee + quota)
  const feeCacheRef = useRef(new Map()); // key: majorId -> number
  const quotaCacheRef = useRef(new Map()); // key: `${majorId}|${academicYear}` -> quotaInfo object

  // debounce timer
  const quotaTimerRef = useRef(null);

  // remember last object URL to revoke
  const lastPreviewUrlRef = useRef(null);

  // ✅ GATE: user must select Academic Year + Department + Major and be allowed
  const gateReady = useMemo(() => {
    return !!form.academicYear && !!form.departmentId && !!form.majorId;
  }, [form.academicYear, form.departmentId, form.majorId]);

  // ✅ If server checked => must be available
  // ✅ If server NOT checked (endpoint error) => allow (same as your fallback behavior)
  const gateAllowed = useMemo(() => {
    if (!gateReady) return false;
    if (quotaInfo.loading) return false;
    if (quotaInfo.checked) return quotaInfo.available === true;
    return true; // server check unavailable => allow
  }, [gateReady, quotaInfo.loading, quotaInfo.checked, quotaInfo.available]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (quotaTimerRef.current) clearTimeout(quotaTimerRef.current);
      if (lastPreviewUrlRef.current)
        URL.revokeObjectURL(lastPreviewUrlRef.current);
    };
  }, []);

  // Load departments (once)
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchDepartments();
        if (response?.data?.success && aliveRef.current) {
          setDepartments(response.data.data || []);
        }
      } catch (err) {
        console.error("Error loading departments:", err);
        if (aliveRef.current)
          setError("Failed to load departments. Please refresh the page.");
      }
    })();
  }, []);

  // Load majors when department changes
  useEffect(() => {
    if (!form.departmentId) {
      setMajors([]);
      setSelectedMajorFee(null);
      setQuotaInfo((p) => ({ ...p, checked: false, message: null }));
      setForm((p) => ({ ...p, majorId: "", faculty: "" }));
      return;
    }

    (async () => {
      try {
        const response = await fetchMajorsByDepartment(form.departmentId);
        if (response?.data?.success && aliveRef.current) {
          setMajors(response.data.data || []);
        }
      } catch (err) {
        console.error("Error loading majors:", err);
        if (aliveRef.current)
          setError("Failed to load majors for selected department.");
      }
    })();
  }, [form.departmentId]);

  // Fill faculty from department (derived)
  useEffect(() => {
    if (!form.departmentId) return;
    const deptId = Number(form.departmentId);
    const selectedDept = departments.find((d) => Number(d.id) === deptId);
    if (selectedDept?.faculty) {
      setForm((prev) =>
        prev.faculty === selectedDept.faculty
          ? prev
          : { ...prev, faculty: selectedDept.faculty }
      );
    }
  }, [form.departmentId, departments]);

  const departmentOptions = useMemo(() => {
    return [
      { value: "", label: "Select Department" },
      ...departments.map((d) => ({ value: String(d.id), label: d.name })),
    ];
  }, [departments]);

  const majorOptions = useMemo(() => {
    return [
      { value: "", label: "Select Major" },
      ...majors.map((m) => ({ value: String(m.id), label: m.major_name })),
    ];
  }, [majors]);

  const validateEmail = (email) => {
    if (!email) return false;
    // simple + fast
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const normalizeAcademicYear = (ay) => String(ay || "").trim();

  // ✅ fetch major fee (cached)
  const loadMajorFee = useCallback(async (majorId) => {
    const id = Number(majorId);
    if (!id) return 0;

    if (feeCacheRef.current.has(id)) return feeCacheRef.current.get(id);

    try {
      const res = await fetchMajor(id);
      const fee = Number(res?.data?.registration_fee ?? 0);
      const safeFee = Number.isFinite(fee) ? fee : 0;
      feeCacheRef.current.set(id, safeFee);
      return safeFee;
    } catch (e) {
      feeCacheRef.current.set(id, 0);
      return 0;
    }
  }, []);

  // ✅ fetch major quota (cached) using your controller endpoint
  // ✅ fetch "can register" (cached) using: GET /registrations/can-register
  const loadMajorQuota = useCallback(async (majorId, academicYear) => {
    const id = Number(majorId);
    const ay = normalizeAcademicYear(academicYear);

    if (!id || !ay) {
      return {
        loading: false,
        checked: false,
        available: true,
        limited: false,
        limit: null,
        used: 0,
        remaining: null,
        message: null,
      };
    }

    const key = `${id}|${ay}`;
    if (quotaCacheRef.current.has(key)) return quotaCacheRef.current.get(key);

    const infoBase = {
      loading: false,
      checked: true,
      available: true,
      limited: false,
      limit: null,
      used: 0,
      remaining: null,
      message: null,
    };

    try {
      const res = await canRegister(id, ay);
      const data = res?.data;

      // We accept BOTH formats:
      // 1) { allowed: true/false }
      // 2) { available: true/false }  (fallback)
      const allowed =
        data?.allowed !== undefined
          ? !!data.allowed
          : data?.available !== undefined
            ? !!data.available
            : true;

      const info = {
        ...infoBase,
        available: allowed,
        limited: !!data?.limited,
        limit: data?.limit ?? null,
        used: Number(data?.used ?? 0) || 0,
        remaining: data?.remaining ?? null,
        message: allowed
          ? null
          : data?.message || "Registration not available for this major/year.",
      };

      quotaCacheRef.current.set(key, info);
      return info;
    } catch (e) {
      // If endpoint fails, don't block user (same behavior as your current code)
      const info = {
        ...infoBase,
        checked: false,
        message:
          "Availability check unavailable right now (server). You can still submit.",
      };
      quotaCacheRef.current.set(key, info);
      return info;
    }
  }, []);

  // ✅ when majorId OR academicYear changes: load fee + quota (debounced)
  useEffect(() => {
    const majorId = form.majorId;
    const academicYear = form.academicYear;

    if (!majorId) {
      setSelectedMajorFee(null);
      setQuotaInfo((p) => ({ ...p, checked: false, message: null }));
      return;
    }

    // debounce quota check (typing academic year, quick major switching)
    if (quotaTimerRef.current) clearTimeout(quotaTimerRef.current);

    quotaTimerRef.current = setTimeout(async () => {
      if (!aliveRef.current) return;

      setQuotaInfo((p) => ({
        ...p,
        loading: true,
        message: null,
      }));

      const [fee, quota] = await Promise.all([
        loadMajorFee(majorId),
        loadMajorQuota(majorId, academicYear),
      ]);

      if (!aliveRef.current) return;

      setSelectedMajorFee(fee);
      setQuotaInfo({
        ...quota,
        loading: false,
      });
    }, 250);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.majorId, form.academicYear, loadMajorFee, loadMajorQuota]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;

      // file handling (profilePicture)
      if (files && files[0]) {
        const file = files[0];
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!validTypes.includes(file.type)) {
          setError("Please upload a valid image file (JPG, JPEG, or PNG)");
          e.target.value = "";
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size must be less than 5MB");
          e.target.value = "";
          return;
        }

        setForm((prev) => ({ ...prev, [name]: file }));

        if (lastPreviewUrlRef.current)
          URL.revokeObjectURL(lastPreviewUrlRef.current);
        const url = URL.createObjectURL(file);
        lastPreviewUrlRef.current = url;
        setProfilePreview(url);

        if (error) setError(null);
        return;
      }

      const nextVal = NUMBER_FIELDS.has(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

      setForm((prev) => {
        if (name === "departmentId") {
          return { ...prev, departmentId: nextVal, majorId: "", faculty: "" };
        }
        return { ...prev, [name]: nextVal };
      });

      if (error) setError(null);
    },
    [error]
  );

  // ✅ map FE keys -> API keys
  const keyMap = useMemo(
    () => ({
      firstName: "first_name",
      lastName: "last_name",
      fullNameKh: "full_name_kh",
      fullNameEn: "full_name_en",
      gender: "gender",
      dateOfBirth: "date_of_birth",
      phoneNumber: "phone_number",
      personalEmail: "personal_email",

      highSchoolName: "high_school_name",
      graduationYear: "graduation_year",
      grade12Result: "grade12_result",

      departmentId: "department_id",
      majorId: "major_id",
      faculty: "faculty",
      shift: "shift",
      batch: "batch",
      academicYear: "academic_year",
      address: "address",
      currentAddress: "current_address",

      fatherName: "father_name",
      fathersDateOfBirth: "fathers_date_of_birth",
      fathersNationality: "fathers_nationality",
      fathersJob: "fathers_job",
      fathersPhoneNumber: "fathers_phone_number",

      motherName: "mother_name",
      motherDateOfBirth: "mother_date_of_birth",
      motherNationality: "mother_nationality",
      mothersJob: "mothers_job",
      motherPhoneNumber: "mother_phone_number",

      guardianName: "guardian_name",
      guardianPhoneNumber: "guardian_phone_number",
      emergencyContactName: "emergency_contact_name",
      emergencyContactPhoneNumber: "emergency_contact_phone_number",
    }),
    []
  );

  const validateRequired = useCallback(() => {
    for (const k of REQUIRED_KEYS) {
      if (!form[k]) return false;
    }
    if (!validateEmail(form.personalEmail)) return false;
    return true;
  }, [form]);

  // ✅ Pre-check quota before opening payment modal (no waste time)
  const ensureMajorAvailableBeforeSubmit = useCallback(async () => {
    const majorId = form.majorId;
    const academicYear = form.academicYear;

    if (!majorId || !academicYear) return true;

    // if already checked and available -> ok
    if (quotaInfo?.checked && quotaInfo?.available) return true;

    // force re-check (and update UI)
    setQuotaInfo((p) => ({ ...p, loading: true, message: null }));
    const quota = await loadMajorQuota(majorId, academicYear);
    if (!aliveRef.current) return false;

    setQuotaInfo({ ...quota, loading: false });

    if (quota.checked && !quota.available) {
      setError(
        "This major is full or registration is closed for the selected academic year. Please choose another major/year."
      );
      return false;
    }
    return true;
  }, [form.majorId, form.academicYear, quotaInfo, loadMajorQuota]);

  const formSubmit = useCallback(async () => {
    const formData = new FormData();

    for (const [key, val] of Object.entries(form)) {
      if (key === "profilePicture") continue;
      if (val === null || val === "") continue;

      const apiKey = keyMap[key];
      if (!apiKey) continue;

      formData.append(apiKey, val);
    }

    if (form.profilePicture && form.profilePicture instanceof File) {
      formData.append("profile_picture", form.profilePicture);
    }

    try {
      setLoading(true);
      const response = await submitRegistration(formData);
      return response.data;
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        setError(errorMessages);
      } else {
        setError(
          err.response?.data?.message ||
          "Registration failed. Please try again."
        );
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [form, keyMap]);

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM);
    setPayPlan(DEFAULT_PAY_PLAN);
    setSelectedMajorFee(null);
    setQuotaInfo({
      loading: false,
      checked: false,
      available: true,
      limited: false,
      limit: null,
      used: 0,
      remaining: null,
      message: null,
    });

    if (lastPreviewUrlRef.current) {
      URL.revokeObjectURL(lastPreviewUrlRef.current);
      lastPreviewUrlRef.current = null;
    }
    setProfilePreview(null);
  }, []);

  const ensureRegistration = useCallback(async () => {
    if (registrationData?.data?.registration_id) return registrationData;
    const regData = await formSubmit();
    setRegistrationData(regData);
    return regData;
  }, [registrationData, formSubmit]);

  const computePayAmount = useCallback((yearFee, plan) => {
    const fee = Number(yearFee || 0);
    if (!Number.isFinite(fee)) return 0;
    if (plan?.type === "SEMESTER") return fee * 0.5;
    return fee;
  }, []);

  const payAmount = useMemo(
    () => computePayAmount(selectedMajorFee, payPlan),
    [selectedMajorFee, payPlan, computePayAmount]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateRequired()) {
        setError("Please fill in all required fields (and use a valid email).");
        return;
      }

      // ✅ prevent wasting time: check major quota before payment modal
      const ok = await ensureMajorAvailableBeforeSubmit();
      if (!ok) return;

      setShowPaymentChoice(true);
    },
    [validateRequired, ensureMajorAvailableBeforeSubmit]
  );

  const handlePaymentMethodSelect = useCallback(
    async (method) => {
      setShowPaymentChoice(false);

      try {
        const regData = await ensureRegistration();
        const registrationId = regData?.data?.registration_id;

        if (method === "qr") {
          setShowQr(true);
          return;
        }

        if (method === "later") {
          if (registrationId) {
            const payload = {
              pay_plan: payPlan.type, // "YEAR" or "SEMESTER"
              semester: payPlan.type === "SEMESTER" ? payPlan.semester : 1,
              amount: payAmount,
            };
            await payLaterApi(registrationId, payload);
          }

          setSuccess({
            title: "Registration Submitted Successfully!",
            message:
              "Your registration has been created. Please complete payment within 7 days at the university finance office.",
            data: regData,
          });

          setTimeout(() => {
            resetForm();
            setSuccess(null);
            setRegistrationData(null);
          }, 8000);
        }
      } catch (e) {
        // formSubmit already sets error
      }
    },
    [ensureRegistration, payPlan.type, payPlan.semester, payAmount, resetForm]
  );

  const handlePaymentSuccess = useCallback(() => {
    setShowQr(false);

    setSuccess({
      title: "Payment Completed!",
      message: "Your registration and payment have been successfully processed.",
      data: registrationData,
    });

    setTimeout(() => {
      resetForm();
      setSuccess(null);
      setRegistrationData(null);
    }, 8000);
  }, [registrationData, resetForm]);

  // ✅ Field configs
  const personalFields = useMemo(
    () => [
      {
        name: "firstName",
        label: "First Name (English)",
        required: true,
        icon: User2,
        placeholder: "First Name",
      },
      {
        name: "lastName",
        label: "Last Name (English)",
        required: true,
        placeholder: "Last Name",
      },
      {
        name: "fullNameKh",
        label: "Full Name (Khmer)",
        placeholder: "ឈ្មោះ នាមត្រកូល",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
        ],
      },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "phoneNumber", label: "Phone Number", icon: Phone, placeholder: "012 345 678" },
      {
        name: "personalEmail",
        label: "Email Address",
        type: "email",
        required: true,
        icon: Mail,
        placeholder: "student@example.com",
      },
      { name: "address", label: "Permanent Address", icon: MapPin, placeholder: "#123, Street ABC" },
      { name: "currentAddress", label: "Current Address", icon: MapPin, placeholder: "Same as permanent" },
    ],
    []
  );

  const familyFieldsFather = useMemo(
    () => [
      { name: "fatherName", label: "Father Name", placeholder: "Father Name" },
      { name: "fathersDateOfBirth", label: "Father Date of Birth", type: "date" },
      { name: "fathersNationality", label: "Father Nationality", placeholder: "Cambodian" },
      { name: "fathersJob", label: "Father Job", placeholder: "Father's Job" },
      { name: "fathersPhoneNumber", label: "Father Phone Number", type: "tel", placeholder: "012 345 678" },
    ],
    []
  );

  const familyFieldsMother = useMemo(
    () => [
      { name: "motherName", label: "Mother Name", placeholder: "Mother Name" },
      { name: "motherDateOfBirth", label: "Mother Date of Birth", type: "date" },
      { name: "motherNationality", label: "Mother Nationality", placeholder: "Cambodian" },
      { name: "mothersJob", label: "Mother Job", placeholder: "Mother's Job" },
      { name: "motherPhoneNumber", label: "Mother Phone Number", type: "tel", placeholder: "012 345 678" },
    ],
    []
  );

  const guardianFields = useMemo(
    () => [
      { name: "guardianName", label: "Guardian Name", placeholder: "Guardian Name" },
      { name: "guardianPhoneNumber", label: "Guardian Phone Number", type: "tel", placeholder: "012 345 678" },
      { name: "emergencyContactName", label: "Emergency Contact Name", placeholder: "Emergency Contact" },
      { name: "emergencyContactPhoneNumber", label: "Emergency Contact Phone", type: "tel", placeholder: "012 345 678" },
    ],
    []
  );

  const schoolFields = useMemo(
    () => [
      { name: "highSchoolName", label: "High School", required: true, placeholder: "High School" },
      { name: "graduationYear", label: "Graduation Year", placeholder: "YYYY" },
      { name: "grade12Result", label: "Grade 12 Result", placeholder: "Grade A-F" },
    ],
    []
  );

  const academicFields = useMemo(
    () => [
      { name: "academicYear", label: "Academic Year", required: true, placeholder: "2026-2027" },
      { name: "departmentId", label: "Department", type: "select", required: true, options: departmentOptions },
      {
        name: "majorId",
        label: "Major",
        type: "select",
        required: true,
        options: majorOptions,
        disabled: !form.departmentId,
      },
      {
        name: "faculty",
        label: "Faculty",
        placeholder: "Select department first",
        readOnly: true,
        className: form.departmentId ? "bg-white/40" : "bg-gray-100/60",
      },
      {
        name: "shift",
        label: "Shift",
        type: "select",
        options: [
          { value: "Morning", label: "Morning" },
          { value: "Afternoon", label: "Afternoon" },
          { value: "Evening", label: "Evening" },
          { value: "Weekend", label: "Weekend" },
        ],
      },
      {
        name: "batch",
        label: "Batch / Generation",
        placeholder: `${currentYear}`,
      },
    ],
    [departmentOptions, majorOptions, form.departmentId]
  );

  // ✅ quota status UI helper
  const quotaBadge = useMemo(() => {
    if (!form.majorId || !form.academicYear) return null;

    if (quotaInfo.loading) {
      return (
        <div className="mt-4 backdrop-blur-xl bg-white/60 border border-white/60 rounded-xl p-3 flex items-center gap-2">
          <Loader size={18} className="animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 font-medium">
            Checking major availability...
          </p>
        </div>
      );
    }

    if (quotaInfo.checked && quotaInfo.available === false) {
      return (
        <div className="mt-4 backdrop-blur-xl bg-red-50/70 border border-red-200/60 rounded-xl p-4 flex items-start gap-3">
          <Lock size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">
              Registration not available
            </p>
            <p className="text-xs text-gray-700 mt-1">
              This major is full or registration is closed for{" "}
              <span className="font-semibold">{form.academicYear}</span>. Please
              choose another.
            </p>
            {quotaInfo.limited && quotaInfo.limit != null ? (
              <p className="text-xs text-gray-600 mt-2">
                Limit: <span className="font-semibold">{quotaInfo.limit}</span>{" "}
                • Used: <span className="font-semibold">{quotaInfo.used}</span>
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    if (quotaInfo.checked && quotaInfo.available === true) {
      return (
        <div className="mt-4 backdrop-blur-xl bg-green-50/70 border border-green-200/60 rounded-xl p-4 flex items-start gap-3">
          <Info size={18} className="text-green-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-green-800">Major available</p>
            {quotaInfo.limited ? (
              <p className="text-xs text-gray-700 mt-1">
                Remaining seats:{" "}
                <span className="font-semibold">
                  {quotaInfo.remaining != null
                    ? quotaInfo.remaining
                    : Math.max(
                      0,
                      (quotaInfo.limit || 0) - (quotaInfo.used || 0)
                    )}
                </span>{" "}
                (Used {quotaInfo.used} / {quotaInfo.limit})
              </p>
            ) : (
              <p className="text-xs text-gray-700 mt-1">
                No limit set for this major/year (unlimited).
              </p>
            )}
          </div>
        </div>
      );
    }

    if (quotaInfo.message) {
      return (
        <div className="mt-4 backdrop-blur-xl bg-yellow-50/70 border border-yellow-200/60 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle
            size={18}
            className="text-yellow-700 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-gray-700">{quotaInfo.message}</p>
        </div>
      );
    }

    return null;
  }, [form.majorId, form.academicYear, quotaInfo]);

  return (
    <section className="min-h-screen -mt-9 relative overflow-hidden font-sans rounded-lg bg-gradient-to-br">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-20 rounded-full blur-3xl"
        />
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/60 p-8 max-w-lg w-full"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-xl">
                  <CheckCircle size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {success.title}
                </h3>
                <p className="text-gray-700 text-base mb-4">{success.message}</p>
              </div>

              {/* ✅ FIX: show student_code from response.data.data (not inside student_account) */}
              <div className="backdrop-blur-xl bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Registration Details:
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Registration ID:</span>{" "}
                    {success?.data?.data?.registration_id ?? "-"}
                  </p>
                  <p>
                    <span className="font-medium">Student Code:</span>{" "}
                    {success?.data?.data?.student_code ?? "-"}
                  </p>
                  <p>
                    <span className="font-medium">Academic Year:</span>{" "}
                    {success?.data?.data?.academic_year ?? "-"}
                  </p>
                </div>
              </div>

              {success.data?.student_account && (
                <div className="backdrop-blur-xl bg-green-50/60 border border-green-200/40 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Your Account Details:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {success.data.student_account.email}
                    </p>
                    <p>
                      <span className="font-medium">Password:</span>{" "}
                      {success.data.student_account.password ??
                        "Already existing account"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    ⚠️ Please save these credentials!
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetForm();
                  setSuccess(null);
                  setRegistrationData(null);
                }}
                className="w-full backdrop-blur-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold overflow-hidden group"
              >
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10">Close</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Method Choice Modal (includes Pay Plan) */}
      <AnimatePresence>
        {showPaymentChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/60 p-8 max-w-md w-full"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPaymentChoice(false)}
                className="absolute top-4 right-4 backdrop-blur-xl bg-white/60 p-2 rounded-full hover:bg-white/80 transition-all duration-300 border border-white/40"
              >
                <X size={20} className="text-gray-600" />
              </motion.button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
                  <CreditCard size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  Choose Payment
                </h3>
                <p className="text-gray-600 text-sm">
                  Select plan first, then method
                </p>

                {selectedMajorFee != null && (
                  <div className="mt-4 backdrop-blur-xl bg-green-50/60 border border-green-200/40 rounded-xl p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Year Fee:</span>
                      <span className="text-xl font-bold text-green-600 ml-2">
                        ${Number(selectedMajorFee).toFixed(2)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Semester payment = <span className="font-semibold">50%</span>{" "}
                      of year fee
                    </p>
                  </div>
                )}
              </div>

              {/* ✅ Pay plan selector */}
              <div className="backdrop-blur-xl bg-white/60 border-2 border-white/60 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Pay Plan
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payPlan"
                      checked={payPlan.type === "YEAR"}
                      onChange={() =>
                        setPayPlan((p) => ({ ...p, type: "YEAR" }))
                      }
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Pay Full Year</p>
                      <p className="text-xs text-gray-600">Pay 100% now</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ${Number(selectedMajorFee || 0).toFixed(2)}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payPlan"
                      checked={payPlan.type === "SEMESTER"}
                      onChange={() =>
                        setPayPlan((p) => ({ ...p, type: "SEMESTER" }))
                      }
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Pay One Semester
                      </p>
                      <p className="text-xs text-gray-600">
                        Pay 50% now + choose semester
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ${(Number(selectedMajorFee || 0) * 0.5).toFixed(2)}
                    </span>
                  </label>

                  {payPlan.type === "SEMESTER" && (
                    <div className="pl-7">
                      <label className="text-xs font-semibold text-gray-700">
                        Which semester?
                      </label>
                      <select
                        className={`${inputClassBase} mt-2`}
                        value={payPlan.semester}
                        onChange={(e) =>
                          setPayPlan((p) => ({
                            ...p,
                            semester: Number(e.target.value),
                          }))
                        }
                      >
                        <option value={1}>Semester 1</option>
                        <option value={2}>Semester 2</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-800">
                  <span className="font-semibold">Amount to pay now:</span>{" "}
                  <span className="font-bold text-green-700">
                    ${Number(payAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePaymentMethodSelect("qr")}
                  disabled={loading}
                  className="group relative w-full backdrop-blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-2xl hover:shadow-[0_20px_60px_rgba(139,92,246,0.5)] transition-all duration-500 border border-white/30 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="backdrop-blur-xl bg-white/20 p-3 rounded-xl">
                      {loading ? (
                        <Loader className="animate-spin" size={28} />
                      ) : (
                        <Smartphone size={28} />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-lg">
                        {loading ? "Processing..." : "Pay with QR Code"}
                      </h4>
                      <p className="text-sm text-white/80 mt-1">
                        Scan and pay using ABA Mobile
                      </p>
                    </div>
                    {!loading && <div className="text-2xl">→</div>}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePaymentMethodSelect("later")}
                  disabled={loading}
                  className="group relative w-full backdrop-blur-xl bg-white/60 border-2 border-white/60 text-gray-800 p-6 rounded-2xl hover:bg-white/80 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-500/20 to-gray-600/20 p-3 rounded-xl border border-white/40">
                      <DollarSign size={28} className="text-gray-700" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-lg">Pay Later</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Submit and pay at campus
                      </p>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                  </div>
                </motion.button>
              </div>

              <div className="mt-6 backdrop-blur-xl bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Note:</span> If you choose "Pay
                  Later", please complete payment within 7 days.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Payment Modal */}
      <AnimatePresence>
        {showQr && registrationData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4"
          >
            <PaymentForm
              registrationId={registrationData.data?.registration_id}
              yearFee={selectedMajorFee}
              payPlan={payPlan}
              amount={payAmount}
              registrationData={registrationData}
              onClose={() => {
                setShowQr(false);
                setShowPaymentChoice(true);
              }}
              onSuccess={handlePaymentSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 right-4 z-50 backdrop-blur-2xl bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(239,68,68,0.4)] border-2 border-red-400/30 max-w-md"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-xl bg-white/20 p-2 rounded-lg flex-shrink-0"
              >
                <AlertTriangle size={20} />
              </motion.div>
              <div className="flex-1">
                <p className="font-medium whitespace-pre-line">{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setError(null)}
                className="hover:bg-red-600/50 rounded-full p-1.5 transition-colors duration-300 flex-shrink-0"
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 backdrop-blur-2xl bg-white/60 rounded-3xl mb-6 shadow-[0_20px_60px_rgba(99,102,241,0.1)] border-2 border-white/80">
            <GraduationCap size={48} className="text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            NovaTech University
          </h1>
          <div className="backdrop-blur-xl bg-white/50 inline-block px-6 py-3 rounded-full border-2 border-white/60 shadow-lg">
            <p className="text-gray-800 text-lg font-semibold">
              Student Registration Portal
            </p>
          </div>
        </div>

        {/* Registration Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60 mb-8"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-t-3xl" />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Info size={20} /> Registration Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span>Valid government-issued ID or passport</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span>High school diploma or equivalent certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span>Official academic transcripts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span>Passport-sized photo (for profile)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span>Parent/Guardian contact information</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <School size={20} /> Registration Steps
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">1</span>
                  <span>Select your academic year and program</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">2</span>
                  <span>Fill in your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">3</span>
                  <span>Provide family and guardian details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">4</span>
                  <span>Upload required documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">5</span>
                  <span>Complete payment and receive confirmation</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-white/40">
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="backdrop-blur-xl bg-blue-50/60 px-6 py-3 rounded-xl border border-blue-200/50">
                <p className="text-xs text-gray-600">Application Deadline</p>
                <p className="font-bold text-blue-600">May 15, 2025</p>
              </div>
              <div className="backdrop-blur-xl bg-purple-50/60 px-6 py-3 rounded-xl border border-purple-200/50">
                <p className="text-xs text-gray-600">Classes Begin</p>
                <p className="font-bold text-purple-600">Aug 20, 2025</p>
              </div>
              <div className="backdrop-blur-xl bg-green-50/60 px-6 py-3 rounded-xl border border-green-200/50">
                <p className="text-xs text-gray-600">Support Hotline</p>
                <p className="font-bold text-green-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ✅ GATE SCREEN: show ONLY selection + quota before full form */}
        {!gateAllowed && (
          <div className="backdrop-blur-2xl bg-white/80 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-2 border-white/80 relative">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl" />

            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Lock size={24} className="text-blue-600" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Check Registration Availability
                </h2>
                <p className="text-sm text-gray-700 font-medium mt-1">
                  Select Academic Year + Department + Major first. If not allowed,
                  the full form stays hidden (no wasting time).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field
                name="academicYear"
                label="Academic Year"
                required
                value={form.academicYear}
                onChange={handleChange}
                placeholder="2026-2027"
              />

              <Field
                type="select"
                name="departmentId"
                label="Department"
                required
                value={form.departmentId}
                onChange={handleChange}
                options={departmentOptions}
              />

              <Field
                type="select"
                name="majorId"
                label="Major"
                required
                value={form.majorId}
                onChange={handleChange}
                options={majorOptions}
                disabled={!form.departmentId}
              />
            </div>

            <div className="mt-4">{quotaBadge}</div>

            <div className="mt-4">
              {!gateReady ? (
                <div className="flex items-start gap-2 text-gray-700">
                  <Info size={18} className="mt-0.5 text-blue-600" />
                  <p className="text-sm font-semibold">
                    Please choose Academic Year, Department, and Major to
                    continue.
                  </p>
                </div>
              ) : quotaInfo.loading ? (
                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Loader className="animate-spin" size={18} />
                  Checking availability...
                </div>
              ) : quotaInfo.checked && quotaInfo.available === false ? (
                <div className="flex items-start gap-2 text-red-700">
                  <Lock size={18} className="mt-0.5" />
                  <p className="text-sm font-semibold">
                    Registration is not available for this Major / Academic Year.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-yellow-700">
                  <AlertTriangle size={18} className="mt-0.5" />
                  <p className="text-sm font-semibold">
                    Availability check unavailable right now (server). You can
                    still proceed when allowed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ FULL FORM: show ONLY when gateAllowed */}
        {gateAllowed && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Section
              title="Personal Information"
              icon={User}
              gradientBar="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              iconGradient="bg-gradient-to-br from-blue-500 to-purple-600"
              index={0}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalFields.map((f) => (
                  <div
                    key={f.name}
                    className={f.name === "personalEmail" ? "md:col-span-2" : ""}
                  >
                    <Field
                      type={f.type || "text"}
                      name={f.name}
                      label={f.label}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required={!!f.required}
                      icon={f.icon}
                      options={f.options}
                      disabled={f.disabled}
                      readOnly={f.readOnly}
                      className={f.className}
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Family Information */}
            <Section
              title="Family Information"
              icon={User}
              gradientBar="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
              iconGradient="bg-gradient-to-br from-purple-500 to-pink-600"
              index={1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyFieldsFather.map((f) => (
                  <Field
                    key={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    label={f.label}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                  />
                ))}

                <div className="md:col-span-3 border-t-2 border-white/40 pt-6 mt-2" />

                {familyFieldsMother.map((f) => (
                  <Field
                    key={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    label={f.label}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                  />
                ))}
              </div>
            </Section>

            {/* Guardian & Emergency Contact */}
            <Section
              title="Guardian & Emergency Contact"
              icon={Shield}
              gradientBar="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500"
              iconGradient="bg-gradient-to-br from-green-500 to-teal-600"
              index={2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guardianFields.map((f) => (
                  <Field
                    key={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    label={f.label}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                  />
                ))}
              </div>
            </Section>

            {/* High School Information */}
            <Section
              title="High School Information"
              icon={University}
              gradientBar="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500"
              iconGradient="bg-gradient-to-br from-orange-500 to-pink-600"
              index={3}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schoolFields.map((f) => (
                  <Field
                    key={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    label={f.label}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={!!f.required}
                  />
                ))}
              </div>
            </Section>

            {/* Academic Information */}
            <Section
              title="Academic Information"
              icon={School}
              gradientBar="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
              iconGradient="bg-gradient-to-br from-blue-500 to-cyan-600"
              index={4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {academicFields.map((f) => (
                  <Field
                    key={f.name}
                    type={f.type || "text"}
                    name={f.name}
                    label={f.label}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={!!f.required}
                    options={f.options}
                    disabled={f.disabled}
                    readOnly={f.readOnly}
                    className={f.className}
                  />
                ))}

                {/* ✅ quota info shown right after academic selection */}
                <div className="md:col-span-3">{quotaBadge}</div>

                {/* Profile Picture */}
                <div className="md:col-span-3 mt-4">
                  <label className={labelClassBase}>Profile Picture</label>
                  <div className="backdrop-blur-2xl bg-white/50 border-2 border-dashed border-white/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-300 cursor-pointer shadow-lg group">
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleChange}
                      className="hidden"
                      id="file-upload"
                      accept="image/png,image/jpeg,image/jpg"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center w-full"
                    >
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover shadow-xl mb-3 border-4 border-white/70"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <User size={40} />
                        </div>
                      )}
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold flex items-center gap-2 text-lg">
                        <Upload size={18} />{" "}
                        {form.profilePicture ? "Change Photo" : "Upload Photo"}
                      </span>
                      <span className="text-xs text-gray-500 mt-2 font-medium">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </Section>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 pb-20">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || (quotaInfo.checked && quotaInfo.available === false)}
                className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 px-16 rounded-3xl font-bold text-lg shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:shadow-[0_30px_80px_rgba(99,102,241,0.6)] transition-all duration-500 overflow-hidden border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader size={22} />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment <CreditCard size={22} />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Registration;
