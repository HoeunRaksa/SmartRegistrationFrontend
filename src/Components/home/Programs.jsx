import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchDepartments } from "../../api/department_api";
import { Card3D } from "../ui/Card";
import { Button } from "../ui/Button";
import "../../styles/3d-effects.css";

const ProgramCard = ({ department, index, onSelect }) => {
  return (
    <Card3D
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
      hover3D={true}
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl backdrop-blur-xl bg-white/90 border border-white/80 gen-z-card shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500">

        {/* Gradient accent top border */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

        {/* Image Section */}
        {department.image_url && (
          <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={department.image_url}
              alt={department.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Code badge on image */}
            {department.code && (
              <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/95 px-3 py-1.5 rounded-full border border-white shadow-lg">
                <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  {department.code}
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 z-20">
              <h3 className="text-2xl font-bold text-white drop-shadow-md">
                {department.name}
              </h3>
            </div>
          </div>
        )}

        {/* Content Section - No image title fallback */}
        {!department.image_url && (
          <div className="p-6 pb-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {department.name}
            </h3>
          </div>
        )}

        <div className="relative flex-1 flex flex-col p-6 pt-4">

          {/* Subtitle/Title */}
          {department.title && department.title !== department.name && (
            <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide opacity-80">
              {department.title}
            </p>
          )}

          {/* Faculty */}
          {department.faculty && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <div className="bg-indigo-50 p-1.5 rounded-md border border-indigo-100">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">{department.faculty}</span>
            </div>
          )}

          {/* Description */}
          {department.description && (
            <div className="mb-6 flex-1">
              <p className="text-base text-gray-700 leading-relaxed font-medium line-clamp-3">
                {department.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onSelect(department)}
              className="w-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-semibold"
            >
              Details
            </Button>

            <Button
              variant="default"
              onClick={() => window.location.href = `/curriculum`}
              className="w-full font-bold shadow-md"
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </Card3D>
  );
};

// Detail Modal Component
const DepartmentModal = ({ department, onClose }) => {
  if (!department) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {department.image_url && (
          <div className="h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
            <img
              src={department.image_url}
              alt={department.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{department.name}</h2>
              {department.faculty && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium border border-white/30">
                  {department.faculty}
                </span>
              )}
            </div>
          </div>
        )}

        {!department.image_url && (
          <div className="p-8 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{department.name}</h2>
            {department.faculty && (
              <span className="bg-white px-3 py-1 rounded-full text-indigo-600 text-sm font-bold border border-indigo-100 shadow-sm">
                {department.faculty}
              </span>
            )}
          </div>
        )}

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {department.description || "No description available."}
            </p>
          </div>

          {(department.contact_email || department.phone_number) && (
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4">Contact Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {department.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <a href={`mailto:${department.contact_email}`} className="text-blue-600 font-semibold truncate block hover:underline">
                        {department.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {department.phone_number && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <a href={`tel:${department.phone_number}`} className="text-purple-600 font-semibold hover:underline">
                        {department.phone_number}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="default"
              onClick={() => window.location.href = `/curriculum`}
              className="px-8 shadow-lg"
            >
              Go to Curriculum
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default function Program() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDepartments();

        if (response.data.success) {
          setDepartments(response.data.data);
        } else {
          setError("Failed to load departments");
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err.response?.data?.message || "Failed to load departments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  if (loading) {
    return (
      <section className="py-20 my-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 p-10 rounded-3xl border-2 border-white/60 shadow-xl">
                <div className="relative">
                  <svg className="animate-spin h-16 w-16 mx-auto mb-6 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  Loading Departments...
                </p>
                <p className="text-sm text-gray-600 mt-2">Please wait while we fetch the latest information</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 my-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-red-50/80 to-white/60 p-10 rounded-3xl border-2 border-red-200/60 shadow-xl max-w-lg">
              <div className="text-center">
                <div className="backdrop-blur-xl bg-red-500/10 p-4 rounded-2xl inline-block mb-4">
                  <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700 font-medium mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (departments.length === 0) {
    return (
      <section className="py-20 my-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 p-10 rounded-3xl border-2 border-white/60 shadow-xl max-w-lg text-center">
              <div className="backdrop-blur-xl bg-gray-500/10 p-4 rounded-2xl inline-block mb-4">
                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Departments Yet</h3>
              <p className="text-gray-600">
                We're currently setting up our academic programs. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 my-4">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-white/50">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Academic Excellence
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-6 drop-shadow-lg"
          >
            Our Departments
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 p-6 rounded-3xl border border-white/60 shadow-xl max-w-4xl mx-auto"
          >
            <p className="text-base sm:text-lg lg:text-xl font-light text-gray-800 leading-relaxed">
              Explore our diverse range of academic departments, each committed to excellence in education,
              research, and innovation. Find the perfect path for your academic journey.
            </p>
          </motion.div>
        </div>

        {/* Department Count Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div className="backdrop-blur-xl bg-white/50 px-6 py-3 rounded-full border-2 border-white/60 shadow-lg">
            <span className="text-sm font-medium text-gray-700">
              <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{departments.length}</span> Department{departments.length !== 1 ? 's' : ''} Available
            </span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {departments.map((department, index) => (
            <ProgramCard
              key={department.id}
              department={department}
              index={index}
              onSelect={setSelectedDept}
            />
          ))}
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {selectedDept && (
            <DepartmentModal
              department={selectedDept}
              onClose={() => setSelectedDept(null)}
            />
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-10 border-2 border-white/50 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Connect with our admissions team to learn more about our programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="relative backdrop-blur-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.6)] hover:scale-105 transition-all duration-500 border border-white/30 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">Contact Admissions</span>
              </a>
              <a
                href="/curriculum"
                className="backdrop-blur-xl bg-white/60 text-gray-800 font-semibold px-8 py-4 rounded-xl hover:bg-white/80 hover:scale-105 transition-all duration-300 border-2 border-white/60 shadow-lg"
              >
                View All Programs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}