import React, { useState } from "react";
const Registration = () => {
  const [form, setForm] = useState({
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
    fatherName: "",
    fathersJob: "",
    motherName: "",
    mothersJob: "",
    guardianName: "",
    guardianPhone: "",
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const inputClass =
    "border border-white glass rounded p-3 outline-none focus:ring-2 focus:ring-white focus:border-white";

  return (
    <section className="w-full min-h-screen flex justify-center items-start body py-8">
      <div className="w-full max-w-4xl glass rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-700 text-center mb-8">
          <span className="text-orange-500">NovaTech</span> University Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ===== Personal Information ===== */}
          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
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
          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
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
          </div>

          {/* ===== Parent / Guardian Information ===== */}
          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
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

          {/* ===== Submit Button ===== */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-orange-500 py-3 px-12 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all text-white"
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
