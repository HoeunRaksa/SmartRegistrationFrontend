import React, { useState, useEffect, createContext } from "react";
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
} from "lucide-react";
import PaymentForm from "../Components/payment/PaymentForm.jsx";
import { submitRegistration } from "../api/registration_api.jsx";
import { fetchDepartments, fetchMajorsByDepartment } from '../api/department_api.jsx';
import { fetchMajor } from '../api/major_api.jsx';

export const ToastContext = createContext();

const Registration = () => {
    const [majors, setMajors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedMajorFee, setSelectedMajorFee] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const [showPaymentChoice, setShowPaymentChoice] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const currentYear = new Date().getFullYear();

    const [form, setForm] = useState({
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

        // Father
        fatherName: "",
        fathersDateOfBirth: "",
        fathersNationality: "",
        fathersJob: "",
        fathersPhoneNumber: "",

        // Mother
        motherName: "",
        motherDateOfBirth: "",
        motherNationality: "",
        mothersJob: "",
        motherPhoneNumber: "",

        // Guardian & Emergency
        guardianName: "",
        guardianPhoneNumber: "",
        emergencyContactName: "",
        emergencyContactPhoneNumber: "",
    });

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const response = await fetchDepartments();
                if (response.data.success) {
                    setDepartments(response.data.data);
                }
            } catch (err) {
                console.error("Error loading departments:", err);
                setError("Failed to load departments. Please refresh the page.");
            }
        };

        loadDepartments();
    }, []);

    useEffect(() => {
        if (!form.departmentId) {
            setMajors([]);
            setSelectedMajorFee(null);
            return;
        }

        const loadMajors = async () => {
            try {
                const response = await fetchMajorsByDepartment(form.departmentId);
                if (response.data.success) {
                    setMajors(response.data.data);
                }
            } catch (err) {
                console.error("Error loading majors:", err);
                setError("Failed to load majors for selected department.");
            }
        };

        loadMajors();
    }, [form.departmentId]);

    useEffect(() => {
        if (form.departmentId) {
            const selectedDept = departments.find(d => d.id === parseInt(form.departmentId));
            if (selectedDept && selectedDept.faculty) {
                setForm(prev => ({ ...prev, faculty: selectedDept.faculty }));
            }
        }
    }, [form.departmentId, departments]);

    // Fetch major fee when major is selected
    useEffect(() => {
        if (!form.majorId) {
            setSelectedMajorFee(null);
            return;
        }

        const loadMajorFee = async () => {
            try {
                const response = await fetchMajor(form.majorId);
                if (response.data) {
                    setSelectedMajorFee(Number(response.data.registration_fee ?? 100));
                }
            } catch (err) {
                console.error("Error loading major fee:", err);
                setSelectedMajorFee(100);
            }
        };

        loadMajorFee();
    }, [form.majorId]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!validTypes.includes(file.type)) {
                setError("Please upload a valid image file (JPG, JPEG, or PNG)");
                e.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                e.target.value = '';
                return;
            }

            setForm({ ...form, [name]: file });

            const previewUrl = URL.createObjectURL(file);
            setProfilePreview(previewUrl);
        } else {
            setForm({ ...form, [name]: value });
        }

        if (error) setError(null);
    };

    const formSubmit = async () => {
        const formData = new FormData();

        const keyMap = {
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
        };

        for (const [key, value] of Object.entries(form)) {
            if (value !== null && value !== "" && key !== "profilePicture") {
                formData.append(keyMap[key], value);
            }
        }

        if (form.profilePicture && form.profilePicture instanceof File) {
            formData.append("profile_picture", form.profilePicture);
        }

        try {
            setLoading(true);
            const response = await submitRegistration(formData);
            console.log("Registration Success:", response.data);

            return response.data;
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                setError(errorMessages);
            } else {
                setError(error.response?.data?.message || "Registration failed. Please try again.");
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!form.firstName || !form.lastName || !form.personalEmail || !form.departmentId || !form.majorId || !form.highSchoolName) {
            setError("Please fill in all required fields");
            return;
        }

        setShowPaymentChoice(true);
    };

    const handlePaymentMethodSelect = async (method) => {
        setShowPaymentChoice(false);

        if (method === 'qr') {
            // First submit registration, then show QR
            try {
                setLoading(true);
                const regData = await formSubmit();
                setRegistrationData(regData);
                setShowQr(true);
            } catch (error) {
                // Error already handled in formSubmit
                console.error("Failed to create registration for payment");
            }
        } else if (method === 'later') {
            await handlePayLater();
        }
    };

    const handlePayLater = async () => {
        try {
            const regData = await formSubmit();

            // Show success message
            setSuccess({
                title: "Registration Submitted Successfully!",
                message: `Your registration has been created. Please complete payment within 7 days at the university finance office.`,
                data: regData
            });

            // Reset form after 5 seconds
            setTimeout(() => {
                resetForm();
                setSuccess(null);
            }, 8000);
        } catch (error) {
            // Error already handled in formSubmit
        }
    };

    const handlePaymentSuccess = () => {
        // Payment completed, show success
        setShowQr(false);

        setSuccess({
            title: "Payment Completed!",
            message: "Your registration and payment have been successfully processed.",
            data: registrationData
        });

        // Reset form after 8 seconds
        setTimeout(() => {
            resetForm();
            setSuccess(null);
            setRegistrationData(null);
        }, 8000);
    };

    const resetForm = () => {
        setForm({
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
        });
        setProfilePreview(null);
        setSelectedMajorFee(null);
    };

    const inputClass = "w-full backdrop-blur-xl bg-white/60 border-2 border-white/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium shadow-lg";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2 ml-1";

    return (
        <section className="min-h-screen -mt-9 relative overflow-hidden font-sans rounded-lg bg-gradient-to-br ">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Success Modal */}
            {success && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4">
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/60 p-8 max-w-lg w-full">
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

                        {success.data?.student_account && (
                            <div className="backdrop-blur-xl bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Your Account Details:</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Student Code:</span> {success.data.student_account.student_code}</p>
                                    <p><span className="font-medium">Email:</span> {success.data.student_account.email}</p>
                                    <p><span className="font-medium">Password:</span> {success.data.student_account.password}</p>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">⚠️ Please save these credentials!</p>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                resetForm();
                                setSuccess(null);
                                setRegistrationData(null);
                            }}
                            className="w-full backdrop-blur-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Method Choice Modal */}
            {showPaymentChoice && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4">
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/60 p-8 max-w-md w-full">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        <button
                            onClick={() => setShowPaymentChoice(false)}
                            className="absolute top-4 right-4 backdrop-blur-xl bg-white/60 p-2 rounded-full hover:bg-white/80 transition-all duration-300 border border-white/40"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
                                <CreditCard size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Choose Payment Method
                            </h3>
                            <p className="text-gray-600 text-sm">Select how you'd like to complete your registration</p>

                            {/* Display Registration Fee */}
                            {selectedMajorFee && (
                                <div className="mt-4 backdrop-blur-xl bg-green-50/60 border border-green-200/40 rounded-xl p-3">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Registration Fee:</span>
                                        <span className="text-2xl font-bold text-green-600 ml-2">
                                            ${Number(selectedMajorFee).toFixed(2)}
                                        </span>

                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handlePaymentMethodSelect('qr')}
                                disabled={loading}
                                className="group relative w-full backdrop-blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-2xl hover:shadow-[0_20px_60px_rgba(139,92,246,0.5)] transition-all duration-500 hover:scale-[1.02] border border-white/30 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="backdrop-blur-xl bg-white/20 p-3 rounded-xl">
                                        {loading ? <Loader className="animate-spin" size={28} /> : <Smartphone size={28} />}
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className="font-bold text-lg">{loading ? 'Processing...' : 'Pay with QR Code'}</h4>
                                        <p className="text-sm text-white/80 mt-1">Scan and pay using ABA Mobile</p>
                                    </div>
                                    {!loading && <div className="text-2xl">→</div>}
                                </div>
                            </button>

                            <button
                                onClick={() => handlePaymentMethodSelect('later')}
                                disabled={loading}
                                className="group relative w-full backdrop-blur-xl bg-white/60 border-2 border-white/60 text-gray-800 p-6 rounded-2xl hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-500/20 to-gray-600/20 p-3 rounded-xl border border-white/40">
                                        <DollarSign size={28} className="text-gray-700" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className="font-bold text-lg">Pay Later</h4>
                                        <p className="text-sm text-gray-600 mt-1">Submit registration and pay at campus</p>
                                    </div>
                                    <div className="text-2xl text-gray-400">→</div>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 backdrop-blur-xl bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700">
                                <span className="font-semibold">Note:</span> If you choose "Pay Later", please complete payment within 7 days at the university finance office.
                            </p>
                        </div>
                    </div>
                </div>
            )}

{/* QR Payment Modal */}
{showQr && registrationData && (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 px-4">
        <PaymentForm
            registrationId={registrationData.data?.registration_id} 
            amount={registrationData.data?.payment_amount || selectedMajorFee}
            registrationData={registrationData}
            onClose={() => {
                setShowQr(false);
                setRegistrationData(null);
            }}
            onSuccess={handlePaymentSuccess}
        />
    </div>
)}


            {/* Error Toast */}
            {error && (
                <div className="fixed top-4 right-4 z-50 backdrop-blur-2xl bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(239,68,68,0.4)] border-2 border-red-400/30 max-w-md animate-slide-in">
                    <div className="flex items-start gap-3">
                        <div className="backdrop-blur-xl bg-white/20 p-2 rounded-lg flex-shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium whitespace-pre-line">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="hover:bg-red-600/50 rounded-full p-1.5 transition-colors duration-300 flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-5 backdrop-blur-2xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-[0_20px_60px_rgba(99,102,241,0.3)] border-2 border-white/30">
                        <GraduationCap size={48} className="text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                        NovaTech University
                    </h1>
                    <div className="backdrop-blur-xl bg-white/50 inline-block px-6 py-3 rounded-full border-2 border-white/60 shadow-lg">
                        <p className="text-gray-800 text-lg font-semibold">Student Registration Portal</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60 relative">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl" />

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
                            <div className="p-3 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Personal Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="relative">
                                <label className={labelClass}>First Name (English) *</label>
                                <User2 className="absolute left-3 top-[55%] text-gray-500" size={18} />
                                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`${inputClass} !pl-10`} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Last Name (English) *</label>
                                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={inputClass} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Full Name (Khmer)</label>
                                <input type="text" name="fullNameKh" value={form.fullNameKh} onChange={handleChange} placeholder="ឈ្មោះ នាមត្រកូល" className={inputClass} />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Gender *</label>
                                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Date of Birth *</label>
                                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Phone Number</label>
                                <Phone className="absolute left-3 top-[55%] text-gray-500" size={18} />
                                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="012 345 678" className={`${inputClass} !pl-10`} />
                            </div>

                            <div className="relative md:col-span-2">
                                <label className={labelClass}>Email Address *</label>
                                <Mail className="absolute left-3 top-[55%] text-gray-500" size={18} />
                                <input type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} placeholder="student@example.com" className={`${inputClass} !pl-10`} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Permanent Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-500" size={18} />
                                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="#123, Street ABC" className={`${inputClass} !pl-10`} />
                            </div>

                            <div className="relative md:col-span-2">
                                <label className={labelClass}>Current Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-500" size={18} />
                                <input type="text" name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Same as permanent" className={`${inputClass} !pl-10`} />
                            </div>
                        </div>
                    </div>

                    {/* Family Information */}
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-t-3xl" />

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
                            <div className="p-3 backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white shadow-lg">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Family Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Father Name</label>
                                <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Father Date of Birth</label>
                                <input type="date" name="fathersDateOfBirth" value={form.fathersDateOfBirth} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Father Nationality</label>
                                <input type="text" name="fathersNationality" value={form.fathersNationality} onChange={handleChange} placeholder="Cambodian" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Father Job</label>
                                <input type="text" name="fathersJob" value={form.fathersJob} onChange={handleChange} placeholder="Father's Job" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Father Phone Number</label>
                                <input type="tel" name="fathersPhoneNumber" value={form.fathersPhoneNumber} onChange={handleChange} placeholder="012 345 678" className={inputClass} />
                            </div>

                            <div className="md:col-span-3 border-t-2 border-white/40 pt-6 mt-2"></div>

                            <div>
                                <label className={labelClass}>Mother Name</label>
                                <input type="text" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother Name" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Date of Birth</label>
                                <input type="date" name="motherDateOfBirth" value={form.motherDateOfBirth} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Nationality</label>
                                <input type="text" name="motherNationality" value={form.motherNationality} onChange={handleChange} placeholder="Cambodian" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Job</label>
                                <input type="text" name="mothersJob" value={form.mothersJob} onChange={handleChange} placeholder="Mother's Job" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Phone Number</label>
                                <input type="tel" name="motherPhoneNumber" value={form.motherPhoneNumber} onChange={handleChange} placeholder="012 345 678" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Guardian & Emergency Contact */}
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-t-3xl" />

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
                            <div className="p-3 backdrop-blur-xl bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl text-white shadow-lg">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                Guardian & Emergency Contact
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Guardian Name</label>
                                <input type="text" name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Guardian Name" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Guardian Phone Number</label>
                                <input type="tel" name="guardianPhoneNumber" value={form.guardianPhoneNumber} onChange={handleChange} placeholder="012 345 678" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Name</label>
                                <input type="text" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} placeholder="Emergency Contact" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Phone</label>
                                <input type="tel" name="emergencyContactPhoneNumber" value={form.emergencyContactPhoneNumber} onChange={handleChange} placeholder="012 345 678" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* High School Information */}
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 rounded-t-3xl" />

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
                            <div className="p-3 backdrop-blur-xl bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl text-white shadow-lg">
                                <University size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                High School Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>High School *</label>
                                <input type="text" name="highSchoolName" value={form.highSchoolName} onChange={handleChange} placeholder="High School" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Graduation Year</label>
                                <input type="text" name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="YYYY" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Grade 12 Result</label>
                                <input type="text" name="grade12Result" value={form.grade12Result} onChange={handleChange} placeholder="Grade A-F" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/60">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-t-3xl" />

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/40">
                            <div className="p-3 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-lg">
                                <School size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Academic Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Department *</label>
                                <select name="departmentId" value={form.departmentId} onChange={handleChange} className={inputClass} required>
                                    <option value="">Select Department</option>
                                    {departments.map((dep) => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Major *</label>
                                <select name="majorId" value={form.majorId} onChange={handleChange} className={inputClass} required disabled={!form.departmentId}>
                                    <option value="">Select Major</option>
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>{major.major_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Faculty</label>
                                <input
                                    type="text"
                                    name="faculty"
                                    value={form.faculty}
                                    onChange={handleChange}
                                    placeholder="Select department first"
                                    className={`${inputClass} ${form.departmentId ? 'bg-white/40' : 'bg-gray-100/60'}`}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Shift</label>
                                <select name="shift" value={form.shift} onChange={handleChange} className={inputClass}>
                                    <option>Morning</option>
                                    <option>Afternoon</option>
                                    <option>Evening</option>
                                    <option>Weekend</option>
                                </select>
                            </div>

                            <div className="md:col-span-3 mt-4">
                                <label className={labelClass}>Profile Picture</label>
                                <div className="backdrop-blur-2xl bg-white/50 border-2 border-dashed border-white/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-300 cursor-pointer shadow-lg group">
                                    <input
                                        type="file"
                                        name="profilePicture"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="file-upload"
                                        accept="image/png,image/jpeg,image/jpg"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                                        {profilePreview ? (
                                            <img src={profilePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-xl mb-3 border-4 border-white/70" />
                                        ) : (
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <User size={40} />
                                            </div>
                                        )}
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold flex items-center gap-2 text-lg">
                                            <Upload size={18} /> {form.profilePicture ? "Change Photo" : "Upload Photo"}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-2 font-medium">PNG, JPG up to 5MB</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6 pb-20">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 px-16 rounded-3xl font-bold text-lg shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:shadow-[0_30px_80px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-500 overflow-hidden border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative flex items-center gap-3">
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={22} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Payment <CreditCard size={22} />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Registration;