import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createDepartment,
  fetchDepartments,
  updateDepartment,
} from "../../../src/api/department_api.jsx";
import {
  Building2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Mail,
  Phone,
  Code,
  FileText,
  Grid3x3,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

/* ================== ANIMATION VARIANTS ================== */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

/* ================== COMPONENT ================== */

const DepartmentsForm = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    faculty: "",
    title: "",
    description: "",
    contact_email: "",
    phone_number: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null); // ✅ NEW: Edit mode
  const [isEditMode, setIsEditMode] = useState(false); // ✅ NEW: Track edit state

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data.data);
    } catch {
      setDepartments([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ NEW: Handle edit mode
  const handleEdit = (department) => {
    setEditingDepartment(department);
    setIsEditMode(true);
    setForm({
      name: department.name,
      code: department.code,
      faculty: department.faculty || "",
      title: department.title || "",
      description: department.description || "",
      contact_email: department.contact_email || "",
      phone_number: department.phone_number || "",
      image: null, // Don't set existing image in form
    });
    // Set existing image as preview
    if (department.image_path) {
      setImagePreview(`http://localhost:8000/storage/${department.image_path}`);
    }
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ NEW: Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingDepartment(null);
    setForm({
      name: "",
      code: "",
      faculty: "",
      title: "",
      description: "",
      contact_email: "",
      phone_number: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();

      // REQUIRED fields (Laravel validation)
      formData.append("name", form.name);
      formData.append("code", form.code);

      // OPTIONAL fields
      ["faculty", "title", "description", "contact_email", "phone_number"].forEach(
        (key) => {
          if (form[key]) formData.append(key, form[key]);
        }
      );

      // IMAGE
      if (form.image) {
        formData.append("image", form.image);
      }


      // ✅ UPDATED: Check if editing or creating
      if (isEditMode && editingDepartment) {
        // Update existing department
        formData.append('_method', 'PUT'); // Laravel method spoofing
        await updateDepartment(editingDepartment.id, formData);
      } else {
        // Create new department
        await createDepartment(formData);
      }

      // Reset form
      setForm({
        name: "",
        code: "",
        faculty: "",
        title: "",
        description: "",
        contact_email: "",
        phone_number: "",
        image: null,
      });

      setImagePreview(null);
      setIsEditMode(false);
      setEditingDepartment(null);
      setSuccess(true);
      loadDepartments();

      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || "Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { key: "name", icon: Building2, placeholder: "Department Name", col: "md:col-span-2" },
    { key: "code", icon: Code, placeholder: "Department Code", col: "" },
    { key: "faculty", icon: Grid3x3, placeholder: "Faculty", col: "" },
    { key: "title", icon: FileText, placeholder: "Title", col: "md:col-span-2" },
    { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-2", multiline: true },
    { key: "contact_email", icon: Mail, placeholder: "Contact Email", col: "" },
    { key: "phone_number", icon: Phone, placeholder: "Phone Number", col: "" },
  ];

  return (
    <div className="space-y-8">
      {/* ================= SUCCESS/ERROR ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Department {isEditMode ? 'updated' : 'created'} successfully!
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FORM ================= */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Edit Department' : 'Create New Department'}
            </h2>
          </div>
          {isEditMode && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelEdit}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
          )}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inputFields.map((field) => {
              const Icon = field.icon;
              const isMultiline = field.multiline;

              return (
                <motion.div
                  key={field.key}
                  variants={itemVariants}
                  className={`relative ${field.col}`}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isMultiline ? (
                    <textarea
                      name={field.key}
                      value={form[field.key] ?? ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
                    />
                  ) : (
                    <input
                      name={field.key}
                      value={form[field.key] ?? ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* ===== Image Upload Section ===== */}
          <motion.div variants={itemVariants} className="space-y-4">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // ✅ 2MB = 2048 * 1024 bytes
                   if (file.size > 10 * 1024 * 1024) {
    setError("Image size must be less than 10MB");
    e.target.value = null;
    return;
  }

                  setError(null);
                  setForm({ ...form, image: file });
                  setImagePreview(URL.createObjectURL(file));
                }}

              />
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-purple-300 p-5 text-center transition-all hover:border-purple-400 hover:shadow-md"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-white/80 shadow-sm">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Upload Department Image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to browse or drag and drop
                    </p>
                  </div>
                </div>
              </motion.div>
            </label>

            {/* Image Preview */}
            <AnimatePresence>
              {form.image && imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-lg bg-white/80 border border-purple-200/60 p-4 shadow-sm">
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {form.image.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(form.image.size / 1024).toFixed(1)} KB • {form.image.type.split('/')[1].toUpperCase()}
                      </p>
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setForm({ ...form, image: null });
                        setImagePreview(null);
                      }}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ===== Submit Button ===== */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {/* Animated shine effect */}
            {!loading && (
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  {isEditMode ? 'Updating Department...' : 'Saving Department...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isEditMode ? 'Update Department' : 'Create Department'}
                </>
              )}
            </span>
          </motion.button>
        </motion.form>
      </motion.div>

      {/* ================= DEPARTMENTS LIST ================= */}
 <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="show"
  className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
>
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Grid3x3 className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">All Departments</h3>
    </div>
    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
      {departments.length} Total
    </span>
  </div>

  {departments.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
        <Building2 className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">No departments yet</p>
      <p className="text-sm text-gray-400 mt-1">
        Create your first department to get started
      </p>
    </motion.div>
  ) : (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {departments.map((d, index) => {
        const imageUrl =
          d.image_path && d.image_path !== ""
            ? `http://localhost:8000/storage/${d.image_path}`
            : null;

        return (
          <motion.div
            key={d.id}
            variants={cardVariants}
            custom={index}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDepartment(d)}
            className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* ================= IMAGE ================= */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
              {imageUrl ? (
                <motion.img
                  src={imageUrl}
                  alt={d.name}
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-purple-300" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/90 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(d);
                  }}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/90 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // delete handler here
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </motion.button>
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-5">
              <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600">
                {d.name}
              </h4>

              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                  <Code className="w-3 h-3" />
                  {d.code}
                </span>
                {d.faculty && (
                  <span className="text-xs text-gray-500">• {d.faculty}</span>
                )}
              </div>

              {d.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {d.description}
                </p>
              )}

              <div className="space-y-1.5 pt-3 border-t border-gray-200">
                {d.contact_email && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    <span className="truncate">{d.contact_email}</span>
                  </div>
                )}
                {d.phone_number && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-green-500" />
                    <span>{d.phone_number}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </motion.div>
        );
      })}
    </motion.div>
  )}
</motion.div>

      {/* ================= DEPARTMENT DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedDepartment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header Image */}
              <div className="relative h-130 bg-gradient-to-br from-blue-500 to-purple-600">
                {selectedDepartment.image_path ? (
                  <img
                    src={`http://localhost:8000/storage/${selectedDepartment.image_path}`}
                    alt={selectedDepartment.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-24 h-24 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDepartment(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedDepartment.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    <Code className="w-4 h-4" />
                    {selectedDepartment.code}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {selectedDepartment.title && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                    <p className="text-sm font-medium text-gray-800">{selectedDepartment.title}</p>
                  </div>
                )}

                {selectedDepartment.faculty && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Faculty</p>
                    <p className="text-sm font-medium text-gray-800">{selectedDepartment.faculty}</p>
                  </div>
                )}

                {selectedDepartment.description && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-gray-700">{selectedDepartment.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {selectedDepartment.contact_email && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Email</p>
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>{selectedDepartment.contact_email}</span>
                      </div>
                    </div>
                  )}

                  {selectedDepartment.phone_number && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Phone</p>
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span>{selectedDepartment.phone_number}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentsForm;