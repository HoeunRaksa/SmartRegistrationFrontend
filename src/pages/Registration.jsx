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
        await formSubmit(); // submit the form after payment is confirmed
        setShowQr(false);   // close the payment modal
    };



    const inputClass =
        "w-full bg-white/50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 py-3 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400";
    const labelClass = "block text-sm font-medium text-gray-600 mb-1 ml-1";

    return (
        <section className="min-h-screen -mt-9 relative overflow-hidden font-sans rounded-lg">
            {showQr && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
                    <PaymentForm
                        setPaymentStatus={setPaymentStatus}   // updates parent status
                        onClose={() => setShowQr(false)}      // close modal
                        onSuccess={handlePaymentSuccess}      // auto-submit form after payment
                    />
                </div>
            )}
            <div className="relative w-full max-w-5xl mx-auto px-1 py-30">
                <div className="text-center mb-10 text-gray-700">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-600 backdrop-blur-md rounded-2xl mb-4 shadow-inner border border-white/30">
                        <GraduationCap size={40} className="text-gray-700" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl my-5 md:text-5xl lg:text-6xl font-bold text-gray-800">
                        NovaTech University
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg font-medium">Student Registration Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ===== Personal Information ===== */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
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
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Family Information</h2>
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
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <University size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">High School Information</h2>
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
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <School size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Academic Information</h2>
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
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-400 hover:bg-orange-50/50 transition cursor-pointer bg-gray-50">
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
                                                className="w-32 h-32 rounded-full object-cover shadow-md mb-2"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 text-gray-400">
                                                <User size={32} />
                                            </div>
                                        )}
                                        <span className="text-orange-600 font-medium flex items-center gap-2">
                                            <Upload size={16} /> {form.profilePicture ? "Change Photo" : "Upload Photo"}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-6 pb-20">
                        <button
                            type="submit"
                            className="group relative bg-gradient-to-r from-orange-400 to-pink-500 text-gray-700 py-4 px-12 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
