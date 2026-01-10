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
} from "lucide-react";
import PaymentForm from "../Components/payment/PaymentForm.jsx";
import { submitRegistration } from "../api/registration_api.jsx";
import { fetchDepartments, fetchMajorsByDepartment } from '../api/department_api.jsx';

export const ToastContext = createContext();

const Registration = () => {
    const [majors, setMajors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showQr, setShowQr] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });

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

        if (form.profilePicture) {
            formData.append("profile_picture", form.profilePicture);
        }

        try {
            setLoading(true);
            const response = await submitRegistration(formData);
            console.log("Registration Success:", response.data);
            return response.data;
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowQr(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            await formSubmit();
            setShowQr(false);
        } catch (error) {
            setShowQr(false);
        }
    };

    const inputClass = "w-full backdrop-blur-xl bg-white/40 border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl px-4 py-3 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 font-light shadow-sm";
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

            {error && (
                <div className="fixed top-4 right-4 z-50 backdrop-blur-xl bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-2xl border border-red-400/30 flex items-center gap-3 animate-slide-in">
                    <X size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-2 hover:bg-red-600 rounded-full p-1">
                        <X size={16} />
                    </button>
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
                    {/* Personal Information */}
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
                            <div className="relative">
                                <label className={labelClass}>First Name (English)</label>
                                <User2 className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`${inputClass} !pl-10`} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Last Name (English)</label>
                                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={inputClass} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Full Name (Khmer)</label>
                                <input type="text" name="fullNameKh" value={form.fullNameKh} onChange={handleChange} placeholder="ឈ្មោះ នាមត្រកូល" className={inputClass} />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Phone Number</label>
                                <Phone className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="012 345 678" className={`${inputClass} !pl-10`} />
                            </div>

                            <div className="relative md:col-span-2">
                                <label className={labelClass}>Email Address</label>
                                <Mail className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} placeholder="student@example.com" className={`${inputClass} !pl-10`} required />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Permanent Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="#123, Street ABC" className={`${inputClass} !pl-10`} />
                            </div>

                            <div className="relative md:col-span-2">
                                <label className={labelClass}>Current Address</label>
                                <MapPin className="absolute left-3 top-[55%] text-gray-400" size={18} />
                                <input type="text" name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Same as permanent" className={`${inputClass} !pl-10`} />
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

                            <div className="md:col-span-3 border-t border-white/30 pt-6 mt-2"></div>

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
                    <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl text-white shadow-lg">
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
                                <select name="departmentId" value={form.departmentId} onChange={handleChange} className={inputClass} required>
                                    <option value="">Select Department</option>
                                    {departments.map((dep) => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Major</label>
                                <select name="majorId" value={form.majorId} onChange={handleChange} className={inputClass} required disabled={!form.departmentId}>
                                    <option value="">Select Major</option>
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>{major.major_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Faculty</label>
                                <input type="text" name="faculty" value={form.faculty} onChange={handleChange} placeholder="Engineering" className={inputClass} required />
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
                                <div className="backdrop-blur-xl bg-white/30 border-2 border-dashed border-white/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer shadow-lg">
                                    <input type="file" name="profilePicture" onChange={handleChange} className="hidden" id="file-upload" accept="image/png,image/jpeg,image/jpg" />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                                        {form.profilePicture ? (
                                            <img src={URL.createObjectURL(form.profilePicture)} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-xl mb-2 border-4 border-white/50" />
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

                    <div className="flex justify-center pt-6 pb-20">
                        <button type="submit" disabled={loading} className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-3xl font-bold shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-3 text-lg">
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Payment <CreditCard size={20} />
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