import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createDepartment, updateDepartment } from "../../../src/api/department_api.jsx";
import {
  Building2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mail,
  Phone,
  Code,
  FileText,
  Trash2,
  Eye,
  Image as ImageIcon,
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
  { key: "name", icon: Building2, placeholder: "Department Name", col: "md:col-span-2", required: true },
  { key: "code", icon: Code, placeholder: "Department Code", col: "", required: true },
  { key: "faculty", icon: FileText, placeholder: "Faculty", col: "" },
  { key: "title", icon: FileText, placeholder: "Title", col: "md:col-span-2" },
  { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-2", multiline: true },
  { key: "contact_email", icon: Mail, placeholder: "Contact Email", col: "" },
  { key: "phone_number", icon: Phone, placeholder: "Phone Number", col: "" },
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/* ================== HELPERS ================== */

const getImageUrl = (department) => {
  if (department?.image_url) return department.image_url;
  if (department?.image_path) return `${department.image_path}`;
  return null;
};

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  },
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  },
  item: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
  },
};

/* ================== COMPONENT ================== */

const DepartmentsForm = ({ onUpdate, editingDepartment, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const isEditMode = Boolean(editingDepartment);

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

      const url = getImageUrl(editingDepartment);
      setImagePreview(url || null);
    } else {
      setForm(INITIAL_FORM_STATE);
      setImagePreview(null);
    }
  }, [editingDepartment]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
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

    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);

    setError(null);
    setForm((prev) => ({ ...prev, image: file }));
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

      if (form.image) formData.append("image", form.image);

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
    <div className="space-y-6">
      <AnimatePresence>
        {success && (
          <Alert
            type="success"
            message={`Department ${isEditMode ? "updated" : "created"} successfully!`}
          />
        )}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      </AnimatePresence>

      <FormShell>
        <FormHeader isEditMode={isEditMode} onCancel={resetForm} />

        <motion.form
          onSubmit={handleSubmit}
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <InputGrid form={form} setForm={setForm} />

          <ImageUpload
            fileRef={fileRef}
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            onImageChange={handleImageChange}
          />

          <SubmitBar
            isEditMode={isEditMode}
            loading={loading}
            onCancel={isEditMode ? resetForm : null}
          />
        </motion.form>
      </FormShell>
    </div>
  );
};

/* ================== UI SUB-COMPONENTS ================== */

const FormShell = ({ children }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]"
  >
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.18]" />
    </div>
    <div className="relative p-6 md:p-7">{children}</div>
  </motion.div>
);

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.98 }}
    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-xl ${type === "success"
        ? "bg-green-50/70 border-green-200/60"
        : "bg-red-50/70 border-red-200/60"
      }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}
    <p className={`text-sm font-semibold ${type === "success" ? "text-green-800" : "text-red-800"}`}>
      {message}
    </p>

    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="ml-auto p-1.5 rounded-full text-red-700 hover:bg-red-100/70 transition-colors"
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <div className="flex items-start gap-3">
      <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {isEditMode ? "Edit Department" : "Create Department"}
        </h2>
        <p className="text-sm text-gray-600">
          {isEditMode
            ? "Update department details and keep your data consistent."
            : "Add a new department with a clean, consistent profile."}
        </p>
      </div>
    </div>

    {isEditMode && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCancel}
        type="button"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm font-semibold text-gray-700 shadow-sm"
      >
        <X className="w-4 h-4" />
        Cancel Edit
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div variants={animations.item} className={field.col}>
      <label className="block">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-700">
            {field.placeholder}
            {field.required ? <span className="text-red-500 ml-1">*</span> : null}
          </span>
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>

          {field.multiline ? (
            <textarea
              name={field.key}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={3}
              className="w-full rounded-2xl bg-white/80 pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all resize-none shadow-sm hover:border-gray-300"
            />
          ) : (
            <input
              name={field.key}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full rounded-2xl bg-white/80 pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all shadow-sm hover:border-gray-300"
            />
          )}

          <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-transparent group-focus-within:ring-blue-400/30 transition" />
        </div>
      </label>
    </motion.div>
  );
};

const ImageUpload = ({ fileRef, form, setForm, imagePreview, setImagePreview, onImageChange }) => (
  <motion.div variants={animations.item} className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-gray-700">Department Image</p>
      <p className="text-xs text-gray-500">Optional • Up to 10MB</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
      <label className="block lg:col-span-3">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImageChange} />
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.995 }}
          className="cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-white/70 hover:bg-white/80 transition-all p-5 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Upload a department cover</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Click to choose an image (JPG/PNG/WebP). Recommended: 1200×800.
              </p>
            </div>
          </div>
        </motion.div>
      </label>

      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {imagePreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="h-full"
            >
              <ImagePreview
                image={form.image}
                imagePreview={imagePreview}
                onRemove={() => {
                  setForm((prev) => ({ ...prev, image: null }));
                  setImagePreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl border border-gray-200 bg-white/60 p-5 shadow-sm h-full flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">No image selected</p>
                <p className="text-xs text-gray-600 mt-0.5">Upload one to enhance department branding.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

const ImagePreview = ({ image, imagePreview, onRemove }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-gray-200 p-4 shadow-sm">
    <div className="relative group shrink-0">
      <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Eye className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="flex-1 min-w-0">
      {image ? (
        <>
          <p className="text-sm font-bold text-gray-900 truncate">{image.name}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {(image.size / 1024).toFixed(1)} KB • {image.type?.split("/")?.[1]?.toUpperCase?.() || "IMAGE"}
          </p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-bold text-gray-900">Current Image</p>
          <p className="text-xs text-gray-600 mt-0.5">Existing department image</p>
        </>
      )}
    </div>

    <motion.button
      type="button"
      whileHover={{ scale: 1.06, rotate: 8 }}
      whileTap={{ scale: 0.96 }}
      onClick={onRemove}
      className="p-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      aria-label="Remove image"
    >
      <Trash2 className="w-4 h-4" />
    </motion.button>
  </div>
);

const SubmitBar = ({ loading, isEditMode, onCancel }) => (
  <motion.div variants={animations.item} className="flex flex-col sm:flex-row gap-3 pt-2">
    {onCancel && (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="sm:w-auto w-full px-5 py-2.5 rounded-2xl border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm font-semibold text-gray-800 shadow-sm disabled:opacity-60"
      >
        Cancel
      </motion.button>
    )}

    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      type="submit"
      className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-bold text-white shadow-[0_16px_40px_-18px_rgba(59,130,246,0.8)] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
    >
      {!loading && (
        <motion.div
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 2.1, repeat: Infinity, repeatDelay: 0.9 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
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
  </motion.div>
);

export default DepartmentsForm;
