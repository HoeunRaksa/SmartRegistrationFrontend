import React, { useState, useEffect, createContext } from "react";
import {
    CheckCircle,
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
} from "lucide-react";
import axios from "axios";
import PaymentForm from "../Components/payment/PaymentForm.jsx";

export const ToastContext = createContext();

const Registration = () => {
    const [majors, setMajors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showQr, setShowQr] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
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
        fatherName: "",
        fathersJob: "",
        motherName: "",
        mothersJob: "",
        guardianName: "",
        guardianPhone: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        address: "",
        currentAddress: "",
    });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/departments")
            .then((res) => res.json())
            .then((data) => data.success && setDepartments(data.data))
            .catch((err) => console.error("Error loading departments:", err));
    }, []);

    useEffect(() => {
        if (!form.departmentId) return setMajors([]);
        fetch(`http://127.0.0.1:8000/api/departments/${form.departmentId}/majors`)
            .then((res) => res.json())
            .then((data) => data.success && setMajors(data.data))
            .catch((err) => console.error("Error loading majors:", err));
    }, [form.departmentId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
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
            fatherName: "father_name",
            fathersJob: "fathers_job",
            motherName: "mother_name",
            mothersJob: "mothers_job",
            guardianName: "guardian_name",
            guardianPhone: "guardian_phone",
            emergencyContactName: "emergency_contact_name",
            emergencyContactPhone: "emergency_contact_phone",
            address: "address",
            currentAddress: "current_address",
            profilePicture: "profile_picture",
        };

        for (const [key, value] of Object.entries(form)) {
            if (value !== null && value !== "") {
                if (key === "profilePicture") {
                    formData.append("profile_picture", value);
                } else {
                    formData.append(keyMap[key], value);
                }
            }
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register/save",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Registration Success:", response.data);
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowQr(true);
    };

    const handlePaymentSuccess = async () => {
        await formSubmit();
        setShowQr(false);
    };

    const inputClass =
        "w-full backdrop-blur-xl bg-white/40 border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl px-4 py-3 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 font-light shadow-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2 ml-1";

    return (
        <section className="min-h-screen -mt-9 relative overflow-hidden font-sans rounded-lg">
            {showQr && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
                    <PaymentForm
                        setPaymentStatus={setPaymentStatus}
                        onClose={() => setShowQr(false)}
                        onSuccess={handlePaymentSuccess}
                    />
                </div>
            )}
            <div className="relative w-full max-w-5xl mx-auto px-1 py-30">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-2xl border border-white/20">
                        <GraduationCap size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl my-5 md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        NovaTech University
                    </h1>
                    <p className="mt-2 text-gray-700 text-lg font-light">Student Registration Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ===== Personal Information ===== */}
                    <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Personal Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* First Name */}
                            <div className="relative">
                                <label className={labelClass}>First Name (English)</label>
                                <User2 className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className={`${inputClass} !pl-10`}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="relative">
                                <label className={labelClass}>Last Name (English)</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Full Name Khmer */}
                            <div className="relative">
                                <label className={labelClass}>Full Name (Khmer)</label>
                                <input
                                    type="text"
                                    name="fullNameKh"
                                    value={form.fullNameKh}
                                    onChange={handleChange}
                                    placeholder="ឈ្មោះ នាមត្រកូល"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div className="relative">
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Date of Birth */}
                            <div className="relative">
                                <label className={labelClass}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="relative">
                                <label className={labelClass}>Phone Number</label>
                                <Phone className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="012 345 678"
                                    className={`${inputClass} !pl-10`}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative md:col-span-2">
                                <label className={labelClass}>Email Address</label>
                                <Mail className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="personalEmail"
                                    value={form.personalEmail}
                                    onChange={handleChange}
                                    placeholder="student@example.com"
                                    className={`${inputClass} !pl-10`}
                                    required
                                />
                            </div>

                            {/* Permanent Address */}
                            <div className="relative">
                                <label className={labelClass}>Permanent Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="#123, Street ABC, Phnom Penh"
                                    className={`${inputClass} !pl-10`}
                                />
                            </div>

                            {/* Current Address */}
                            <div className="relative">
                                <label className={labelClass}>Current Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="currentAddress"
                                    value={form.currentAddress}
                                    onChange={handleChange}
                                    placeholder="Same as permanent"
                                    className={`${inputClass} !pl-10`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Family Information */}
                    <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white shadow-lg">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Family Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Father Name</label>
                                <input
                                    type="text"
                                    name="fatherName"
                                    value={form.fatherName}
                                    onChange={handleChange}
                                    placeholder="Father Name"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Father Job</label>
                                <input
                                    type="text"
                                    name="fathersJob"
                                    value={form.fathersJob}
                                    onChange={handleChange}
                                    placeholder="Father's Job"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Name</label>
                                <input
                                    type="text"
                                    name="motherName"
                                    value={form.motherName}
                                    onChange={handleChange}
                                    placeholder="Mother Name"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Mother Job</label>
                                <input
                                    type="text"
                                    name="mothersJob"
                                    value={form.mothersJob}
                                    onChange={handleChange}
                                    placeholder="Mother Job"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* High School Information */}
                    <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl text-white shadow-lg">
                                <University size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                High School Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>High School</label>
                                <input
                                    type="text"
                                    name="highSchoolName"
                                    value={form.highSchoolName}
                                    onChange={handleChange}
                                    placeholder="High School"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Graduation Year</label>
                                <input
                                    type="text"
                                    name="graduationYear"
                                    value={form.graduationYear}
                                    onChange={handleChange}
                                    placeholder="YYYY"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Grade 12 Result</label>
                                <input
                                    type="text"
                                    name="grade12Result"
                                    value={form.grade12Result}
                                    onChange={handleChange}
                                    placeholder="Grade A-F"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-lg">
                                <School size={24} />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Academic Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Department</label>
                                <select
                                    name="departmentId"
                                    value={form.departmentId}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dep) => (
                                        <option key={dep.id} value={dep.id}>
                                            {dep.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Major</label>
                                <select
                                    name="majorId"
                                    value={form.majorId}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                    disabled={!form.departmentId}
                                >
                                    <option value="">Select Major</option>
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.major_name}
                                        </option>
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
                                    placeholder="Engineering"
                                    className={inputClass}
                                    required
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

                            {/* Profile Picture */}
                            <div className="md:col-span-3 mt-4">
                                <label className={labelClass}>Profile Picture</label>
                                <div className="backdrop-blur-xl bg-white/30 border-2 border-dashed border-white/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer shadow-lg">
                                    <input
                                        type="file"
                                        name="profilePicture"
                                        onChange={handleChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                                        {form.profilePicture ? (
                                            <img
                                                src={URL.createObjectURL(form.profilePicture)}
                                                alt="Preview"
                                                className="w-32 h-32 rounded-full object-cover shadow-xl mb-2 border-4 border-white/50"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2 text-white shadow-lg">
                                                <User size={32} />
                                            </div>
                                        )}
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold flex items-center gap-2">
                                            <Upload size={16} /> {form.profilePicture ? "Change Photo" : "Upload Photo"}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1 font-light">PNG, JPG up to 5MB</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-6 pb-20">
                        <button
                            type="submit"
                            className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-3xl font-bold shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden border border-white/20"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-3 text-lg">
                                Proceed to Payment <CreditCard size={20} />
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Registration;