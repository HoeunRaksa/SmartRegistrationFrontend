import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { CheckCircle, X, Loader, Upload, GraduationCap, User, Phone, MapPin, Mail, School, FileText, CreditCard } from "lucide-react";
export const ToastContext = createContext();
import PaymentForm from '../Components/PaymentForm.jsx';
const Registration = () => {
  const [form, setForm] = useState({
    studentID: "", fullNameKh: "", fullNameEn: "", gender: "Male",
    dateOfBirth: "", nationalID: "", address: "", currentAddress: "",
    phoneNumber: "", personalEmail: "",
    highSchoolName: "", graduationYear: "", grade12ExamCenter: "",
    grade12Result: "", faculty: "", major: "", shift: "Morning",
    batch: "", academicYear: "", profilePicture: null,
    // Extra fields
    fatherName: "", fathersJob: "", motherName: "", mothersJob: "",
    guardianName: "", guardianPhone: "",
    emergencyContactName: "", emergencyContactPhone: "",
    previousSchool: "", certificate: "",
    bloodType: "", medicalConditions: "",
    linkedin: "", facebook: "",
    studyMode: "On-Campus", interests: "",
  });

  const [showQr, setShowQr] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowQr(true);
  };

useEffect(() => {
  if (paymentStatus !== "PAID") return;

  setShowQr(false);

  const secondTimer = setTimeout(() => {
    console.log("Second timer after payment fired");
    // Another action
  }, 3000);

  return () => clearTimeout(secondTimer);
}, [paymentStatus]);

  const inputClass = "w-full  bg-white/50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 py-3 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1 ml-1";
  const InputGroup = ({ label, icon: Icon, children }) => (
    <div className="relative group">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />}
        <div className={`${Icon ? "pl-8" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );


  return (
    <section className="min-h-screen -mt-9 bg-slate-50 relative overflow-hidden font-sans rounded-lg">

      <div className="absolute top-0 left-0 w-full h-120 bg-gradient-to-br from-orange-400 to-pink-600 rounded-b-[50px] shadow-lg z-0"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
      {showQr && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
          <PaymentForm
            setPaymentStatus={setPaymentStatus}
            onClose={() => setShowQr(false)}
          />
        </div>
      )}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-30">
        <div className="text-center mb-10 text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-inner border border-white/30">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
            NovaTech University
          </h1>
          <p className="mt-2 text-orange-100 text-lg font-medium">Student Registration Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">

          {/* ===== Personal Information ===== */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputGroup label="Student ID">
                <input type="text" name="studentID" value={form.studentID} onChange={handleChange} className={inputClass} required placeholder="NTU-2024-XXXX" />
              </InputGroup>

              <InputGroup label="Full Name (Khmer)">
                <input type="text" name="fullNameKh" value={form.fullNameKh} onChange={handleChange} className={inputClass} required placeholder="ឈ្មោះ នាមត្រកូល" />
              </InputGroup>

              <InputGroup label="Full Name (English)">
                <input type="text" name="fullNameEn" value={form.fullNameEn} onChange={handleChange} className={inputClass} required placeholder="First Last" />
              </InputGroup>

              <InputGroup label="Gender">
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </InputGroup>

              <InputGroup label="Date of Birth">
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
              </InputGroup>

              <InputGroup label="National ID / Passport">
                <input type="text" name="nationalID" value={form.nationalID} onChange={handleChange} className={inputClass} placeholder="ID Number" />
              </InputGroup>

              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Permanent Address" icon={MapPin}>
                  <input type="text" name="address" value={form.address} onChange={handleChange} className={`${inputClass} !pl-10`} placeholder="#123, Street ABC, Phnom Penh" />
                </InputGroup>
                <InputGroup label="Current Address" icon={MapPin}>
                  <input type="text" name="currentAddress" value={form.currentAddress} onChange={handleChange} className={`${inputClass} !pl-10`} placeholder="Same as permanent" />
                </InputGroup>
              </div>

              <InputGroup label="Phone Number" icon={Phone}>
                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={`${inputClass} !pl-10`} placeholder="012 345 678" />
              </InputGroup>

              <InputGroup label="Email Address" icon={Mail}>
                <input type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} className={`${inputClass} !pl-10`} required placeholder="student@example.com" />
              </InputGroup>
            </div>
          </div>

          {/* ===== Academic Information ===== */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <School size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Academic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputGroup label="High School Name">
                <input type="text" name="highSchoolName" value={form.highSchoolName} onChange={handleChange} className={inputClass} required placeholder="School Name" />
              </InputGroup>

              <InputGroup label="Graduation Year">
                <input type="text" name="graduationYear" value={form.graduationYear} onChange={handleChange} className={inputClass} required placeholder="2023" />
              </InputGroup>

              <InputGroup label="Grade 12 Result">
                <input type="text" name="grade12Result" value={form.grade12Result} onChange={handleChange} className={inputClass} placeholder="Grade A-F" />
              </InputGroup>

              <div className="md:col-span-3 border-t border-gray-100 my-2"></div>

              <InputGroup label="Faculty">
                <input type="text" name="faculty" value={form.faculty} onChange={handleChange} className={inputClass} required placeholder="Engineering" />
              </InputGroup>

              <InputGroup label="Major">
                <input type="text" name="major" value={form.major} onChange={handleChange} className={inputClass} required placeholder="Computer Science" />
              </InputGroup>

              <InputGroup label="Shift">
                <select name="shift" value={form.shift} onChange={handleChange} className={inputClass}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Weekend</option>
                </select>
              </InputGroup>

              <InputGroup label="Batch">
                <input type="text" name="batch" value={form.batch} onChange={handleChange} className={inputClass} placeholder="Gen 10" />
              </InputGroup>

              <InputGroup label="Academic Year">
                <input type="text" name="academicYear" value={form.academicYear} onChange={handleChange} className={inputClass} placeholder="2024-2025" />
              </InputGroup>

              <div className="md:col-span-3 mt-4">
                <label className={labelClass}>Profile Picture</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-400 hover:bg-orange-50/50 transition cursor-pointer bg-gray-50">
                  <input type="file" name="profilePicture" onChange={handleChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                    {form.profilePicture ? (
                      <img src={URL.createObjectURL(form.profilePicture)} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-md mb-2" />
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

          {/* ===== Submit Button ===== */}
          <div className="flex justify-center pt-6 pb-20">
            <button
              type="submit"
              className="group relative bg-gray-900 text-white py-4 px-12 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
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