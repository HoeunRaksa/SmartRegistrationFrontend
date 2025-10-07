import React, { useState } from "react";
import PaymentForm from "../Components/PaymentForm.jsx";
const Registration = () => {
  const [form, setForm] = useState({
    // ===== Personal Information =====
    studentID: "",
    fullNameKh: "",
    fullNameEn: "",
    gender: "Other",
    dateOfBirth: "",
    nationalID: "",
    address: "",
    currentAddress: "",
    phoneNumber: "",
    personalEmail: "",

    // ===== Academic Information =====
    highSchoolName: "",
    graduationYear: "",
    grade12ExamCenter: "",
    grade12Result: "",
    faculty: "",
    major: "",
    shift: "Morning",
    batch: "",
    academicYear: "",
    profilePicture: null,

    // ===== Parent / Guardian Information =====
    fatherName: "",
    fathersJob: "",
    motherName: "",
    mothersJob: "",
    guardianName: "",
    guardianPhone: "",

    // ===== Emergency Contact =====
    emergencyContactName: "",
    emergencyContactPhone: "",

    // ===== Previous Education =====
    previousSchool: "",
    certificate: "",

    // ===== Medical Information =====
    bloodType: "",
    medicalConditions: "",

    // ===== Social / Online Profiles =====
    linkedin: "",
    facebook: "",

    // ===== Preferences / Interests =====
    studyMode: "On-Campus",
    interests: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const [showQr, setShowQr] = useState(false);
  const handleSubmit = (e) => {
      e.preventDefault();
      setShowQr(true);
  };
  const inputClass =
    "border border-white glass rounded p-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300";

  return (
    <section className="w-full min-h-screen flex justify-center items-start py-8 my-8 glass overflow-y-auto">
    {showQr && <PaymentForm onClose={() => setShowQr(false)} />}
      <div className="w-full max-w-6xl p-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-700 text-center mb-12">
          <span className="text-orange-500">NovaTech</span> University Registration
        </h1>

        <form  className="space-y-10">
          {/* ===== Personal Information ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="studentID" placeholder="Student ID" value={form.studentID} onChange={handleChange} className={inputClass} required />
              <input type="text" name="fullNameKh" placeholder="Full Name (Khmer)" value={form.fullNameKh} onChange={handleChange} className={inputClass} required />
              <input type="text" name="fullNameEn" placeholder="Full Name (English)" value={form.fullNameEn} onChange={handleChange} className={inputClass} required />
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
              <input type="text" name="nationalID" placeholder="National ID / Passport" value={form.nationalID} onChange={handleChange} className={inputClass} />
              <input type="text" name="address" placeholder="Permanent Address" value={form.address} onChange={handleChange} className={inputClass} />
              <input type="text" name="currentAddress" placeholder="Current Address" value={form.currentAddress} onChange={handleChange} className={inputClass} />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className={inputClass} />
              <input type="email" name="personalEmail" placeholder="Personal Email" value={form.personalEmail} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          {/* ===== Academic Information ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="highSchoolName" placeholder="High School Name" value={form.highSchoolName} onChange={handleChange} className={inputClass} required />
              <input type="text" name="graduationYear" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} className={inputClass} required />
              <input type="text" name="grade12ExamCenter" placeholder="Grade 12 Exam Center" value={form.grade12ExamCenter} onChange={handleChange} className={inputClass} />
              <input type="text" name="grade12Result" placeholder="Grade 12 Result (A-F)" value={form.grade12Result} onChange={handleChange} className={inputClass} />
              <input type="text" name="faculty" placeholder="Faculty" value={form.faculty} onChange={handleChange} className={inputClass} required />
              <input type="text" name="major" placeholder="Major" value={form.major} onChange={handleChange} className={inputClass} required />
              <select name="shift" value={form.shift} onChange={handleChange} className={inputClass}>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
              <input type="text" name="batch" placeholder="Batch" value={form.batch} onChange={handleChange} className={inputClass} />
              <input type="text" name="academicYear" placeholder="Academic Year" value={form.academicYear} onChange={handleChange} className={inputClass} />
              <input type="file" name="profilePicture" onChange={handleChange} className={inputClass} />
            </div>
            {/* ===== Profile Picture Preview ===== */}
            {form.profilePicture && (
              <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
                <img
                  src={URL.createObjectURL(form.profilePicture)}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-orange-400"
                />
              </div>
            )}
          </div>

          {/* ===== Parent / Guardian Information ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Parent / Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} className={inputClass} />
              <input type="text" name="fathersJob" placeholder="Father's Job" value={form.fathersJob} onChange={handleChange} className={inputClass} />
              <input type="text" name="motherName" placeholder="Mother's Name" value={form.motherName} onChange={handleChange} className={inputClass} />
              <input type="text" name="mothersJob" placeholder="Mother's Job" value={form.mothersJob} onChange={handleChange} className={inputClass} />
              <input type="text" name="guardianName" placeholder="Guardian's Name" value={form.guardianName} onChange={handleChange} className={inputClass} />
              <input type="tel" name="guardianPhone" placeholder="Guardian's Phone" value={form.guardianPhone} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* ===== Emergency Contact ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="emergencyContactName" placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={handleChange} className={inputClass} />
              <input type="tel" name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* ===== Previous Education ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Previous Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="previousSchool" placeholder="Previous School / College" value={form.previousSchool} onChange={handleChange} className={inputClass} />
              <input type="text" name="certificate" placeholder="Certificate / Diploma" value={form.certificate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* ===== Medical Information ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="bloodType" placeholder="Blood Type" value={form.bloodType} onChange={handleChange} className={inputClass} />
              <textarea name="medicalConditions" placeholder="Medical Conditions (if any)" value={form.medicalConditions} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* ===== Social / Online Profiles ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Social / Online Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="url" name="linkedin" placeholder="LinkedIn Profile" value={form.linkedin} onChange={handleChange} className={inputClass} />
              <input type="url" name="facebook" placeholder="Facebook Profile" value={form.facebook} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* ===== Preferences / Interests ===== */}
          <div className="glass p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-orange-400 pb-1">
              Preferences / Interests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="studyMode" value={form.studyMode} onChange={handleChange} className={inputClass}>
                <option>On-Campus</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>
              <textarea name="interests" placeholder="Your Interests / Hobbies" value={form.interests} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* ===== Submit Button ===== */}
          <div className="flex justify-center">
            <button
               onClick={handleSubmit}
              className="bg-orange-500 py-3 px-12 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all text-white text-lg"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default Registration;
