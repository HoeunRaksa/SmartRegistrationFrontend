import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createDepartment,
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
  Trash2,
  Eye,
} from "lucide-react";

/* ================== CONSTANTS ================== */

const INITIAL_FORM_STATE = {
  name: "",
  code: "",
  faculty: "",
  title: "",
  description: "",
  contact_email: "",
  phone_number: "",
  image: null,
};

const INPUT_FIELDS = [
  { key: "name", icon: Building2, placeholder: "Department Name", col: "md:col-span-2" },
  { key: "code", icon: Code, placeholder: "Department Code", col: "" },
  { key: "faculty", icon: FileText, placeholder: "Faculty", col: "" },
  { key: "title", icon: FileText, placeholder: "Title", col: "md:col-span-2" },
  { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-2", multiline: true },
  { key: "contact_email", icon: Mail, placeholder: "Contact Email", col: "" },
  { key: "phone_number", icon: Phone, placeholder: "Phone Number", col: "" },
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/* ================== HELPER FUNCTIONS ================== */

const getImageUrl = (department) => {
  if (department?.image_url) {
    return department.image_url;
  }
  if (department?.image_path) {
    return `${department.image_path}`;
  }
  return null;
};

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
  },
};

/* ================== COMPONENT ================== */

const DepartmentsForm = ({ onUpdate, editingDepartment, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!editingDepartment;

  // ✅ Populate form when editingDepartment changes
  useEffect(() => {
    if (editingDepartment) {
      setForm({
        name: editingDepartment.name,
        code: editingDepartment.code,
        faculty: editingDepartment.faculty || "",
        title: editingDepartment.title || "",
        description: editingDepartment.description || "",
        contact_email: editingDepartment.contact_email || "",
        phone_number: editingDepartment.phone_number || "",
        image: null,
      });
      
      const imageUrl = getImageUrl(editingDepartment);
      if (imageUrl) {
        setImagePreview(imageUrl);
      }
    } else {
      setForm(INITIAL_FORM_STATE);
      setImagePreview(null);
    }
  }, [editingDepartment]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setImagePreview(null);
    if (onCancelEdit) onCancelEdit();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 10MB");
      e.target.value = null;
      return;
    }

    setError(null);
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("code", form.code);

      ["faculty", "title", "description", "contact_email", "phone_number"].forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (form.image) {
        formData.append("image", form.image);
      }

      if (isEditMode) {
        await updateDepartment(editingDepartment.id, formData);
      } else {
        await createDepartment(formData);
      }

      resetForm();
      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= ALERTS ================= */}
      <AnimatePresence>
        {success && (
          <Alert type="success" message={`Department ${isEditMode ? "updated" : "created"} successfully!`} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* ================= FORM ================= */}
      <FormSection
        isEditMode={isEditMode}
        onCancel={resetForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        onImageChange={handleImageChange}
        loading={loading}
      />
    </div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm ${
      type === "success"
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}
    <p className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>
      {message}
    </p>
    {onClose && (
      <button onClick={onClose} className="ml-auto text-red-600 hover:text-red-800">
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

const FormSection = ({ isEditMode, onCancel, onSubmit, form, setForm, imagePreview, setImagePreview, onImageChange, loading }) => (
  <motion.div
    variants={animations.fadeUp}
    initial="hidden"
    animate="show"
    className="relative overflow-hidden rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
  >
    <FormHeader isEditMode={isEditMode} onCancel={onCancel} />
    
    <motion.form
      onSubmit={onSubmit}
      variants={animations.container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <InputGrid form={form} setForm={setForm} />
      <ImageUpload
        form={form}
        setForm={setForm}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        onImageChange={onImageChange}
      />
      <SubmitButton loading={loading} isEditMode={isEditMode} />
    </motion.form>
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Department" : "Create New Department"}
      </h2>
    </div>
    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        type="button"
        className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
      >
        <X className="w-4 h-4" />
        Cancel
      </motion.button>
    )}
  </div>
);

const InputGrid = ({ form, setForm }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {INPUT_FIELDS.map((field) => (
      <InputField key={field.key} field={field} form={form} setForm={setForm} />
    ))}
  </div>
);

const InputField = ({ field, form, setForm }) => {
  const Icon = field.icon;
  const value = form[field.key] ?? "";
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <motion.div variants={animations.item} className={`relative ${field.col}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Icon className="w-3.5 h-3.5" />
      </div>
      {field.multiline ? (
        <textarea
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={2}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
        />
      ) : (
        <input
          name={field.key}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
        />
      )}
    </motion.div>
  );
};

const ImageUpload = ({ form, setForm, imagePreview, setImagePreview, onImageChange }) => (
  <motion.div variants={animations.item} className="space-y-4">
    <label className="block">
      <input type="file" accept="image/*" hidden onChange={onImageChange} />
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
            <p className="text-sm font-semibold text-gray-800">Upload Department Image</p>
            <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
          </div>
        </div>
      </motion.div>
    </label>

    <AnimatePresence>
      {imagePreview && (
        <ImagePreview
          image={form.image}
          imagePreview={imagePreview}
          onRemove={() => {
            setForm({ ...form, image: null });
            setImagePreview(null);
          }}
        />
      )}
    </AnimatePresence>
  </motion.div>
);

const ImagePreview = ({ image, imagePreview, onRemove }) => (
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
        {image ? (
          <>
            <p className="text-sm font-semibold text-gray-800 truncate">{image.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(image.size / 1024).toFixed(1)} KB • {image.type.split("/")[1].toUpperCase()}
            </p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-800">Current Image</p>
            <p className="text-xs text-gray-500 mt-1">Existing department image</p>
          </>
        )}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    variants={animations.item}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
  >
    {!loading && (
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
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
          {isEditMode ? "Updating Department..." : "Saving Department..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Department" : "Create Department"}
        </>
      )}
    </span>
  </motion.button>
);

export default DepartmentsForm;