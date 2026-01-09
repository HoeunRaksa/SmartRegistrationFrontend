import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createDepartment,
  fetchDepartments,
  updateDepartment,
  deleteDepartment,
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
  { key: "faculty", icon: Grid3x3, placeholder: "Faculty", col: "" },
  { key: "title", icon: FileText, placeholder: "Title", col: "md:col-span-2" },
  { key: "description", icon: FileText, placeholder: "Description", col: "md:col-span-2", multiline: true },
  { key: "contact_email", icon: Mail, placeholder: "Contact Email", col: "" },
  { key: "phone_number", icon: Phone, placeholder: "Phone Number", col: "" },
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/* ================== HELPER FUNCTIONS ================== */

const getImageUrl = (department) => {
  // Backend provides full URL in image_url
  if (department?.image_url) {
    return department.image_url;
  }
  // Fallback if only image_path is provided
  if (department?.image_path) {
    return `https://study.learner-teach.online/${department.image_path}`;
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
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  },
};

/* ================== COMPONENT ================== */

const DepartmentsForm = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const isEditMode = !!editingDepartment;

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

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setImagePreview(null);
    setEditingDepartment(null);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setForm({
      name: department.name,
      code: department.code,
      faculty: department.faculty || "",
      title: department.title || "",
      description: department.description || "",
      contact_email: department.contact_email || "",
      phone_number: department.phone_number || "",
      image: null,
    });
    
    // Set existing image preview using helper function
    const imageUrl = getImageUrl(department);
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDepartment(departmentId);
      setSuccess(true);
      loadDepartments();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete department");
    }
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
      loadDepartments();
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

      {/* ================= DEPARTMENTS LIST ================= */}
      <DepartmentsList
        departments={departments}
        onEdit={handleEdit}
        onView={setSelectedDepartment}
        onDelete={handleDelete}
      />

      {/* ================= DETAIL MODAL ================= */}
      <DepartmentModal
        department={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
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

const DepartmentsList = ({ departments, onEdit, onView, onDelete }) => (
  <motion.div
    variants={animations.fadeUp}
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
      <EmptyState />
    ) : (
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {departments.map((dept) => (
          <DepartmentCard 
            key={dept.id} 
            department={dept} 
            onEdit={onEdit} 
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    )}
  </motion.div>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Building2 className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No departments yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first department to get started</p>
  </motion.div>
);

const DepartmentCard = ({ department, onEdit, onView, onDelete }) => {
  const imageUrl = getImageUrl(department);

  return (
    <motion.div
      variants={animations.card}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onView(department)}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <DepartmentCardImage 
        imageUrl={imageUrl} 
        name={department.name} 
        onEdit={() => onEdit(department)}
        onDelete={() => onDelete(department.id)}
      />
      <DepartmentCardContent department={department} />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

const DepartmentCardImage = ({ imageUrl, name, onEdit, onDelete }) => (
  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
    {/* Image */}
    {imageUrl ? (
      <motion.img src={imageUrl} alt={name} /* ... */ />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon className="w-16 h-16 text-purple-300" />
      </div>
    )}

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* 🔵 EDIT AND DELETE BUTTONS ARE HERE 🔴 */}
    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Edit Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/90 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit className="w-4 h-4 text-blue-600" />
      </motion.button>

      {/* Delete Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/90 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </motion.button>
    </div>
  </div>
);

const DepartmentCardContent = ({ department }) => (
  <div className="p-5">
    <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600">
      {department.name}
    </h4>

    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
        <Code className="w-3 h-3" />
        {department.code}
      </span>
      {department.faculty && (
        <span className="text-xs text-gray-500">• {department.faculty}</span>
      )}
    </div>

    {department.description && (
      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{department.description}</p>
    )}

    <div className="space-y-1.5 pt-3 border-t border-gray-200">
      {department.contact_email && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail className="w-3.5 h-3.5 text-purple-500" />
          <span className="truncate">{department.contact_email}</span>
        </div>
      )}
      {department.phone_number && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3.5 h-3.5 text-green-500" />
          <span>{department.phone_number}</span>
        </div>
      )}
    </div>
  </div>
);

const DepartmentModal = ({ department, onClose }) => {
  if (!department) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <DepartmentModalHeader department={department} onClose={onClose} />
          <DepartmentModalContent department={department} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DepartmentModalHeader = ({ department, onClose }) => {
  const imageUrl = getImageUrl(department);

  return (
    <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={department.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
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
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
      >
        <X className="w-5 h-5" />
      </motion.button>

      <div className="absolute bottom-6 left-6 right-6">
        <h2 className="text-3xl font-bold text-white mb-2">{department.name}</h2>
        <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
          <Code className="w-4 h-4" />
          {department.code}
        </span>
      </div>
    </div>
  );
};

const DepartmentModalContent = ({ department }) => (
  <div className="p-6 space-y-4">
    {department.title && (
      <InfoField label="Title" value={department.title} />
    )}
    {department.faculty && (
      <InfoField label="Faculty" value={department.faculty} />
    )}
    {department.description && (
      <InfoField label="Description" value={department.description} />
    )}

    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
      {department.contact_email && (
        <ContactField icon={Mail} label="Email" value={department.contact_email} iconColor="text-purple-500" />
      )}
      {department.phone_number && (
        <ContactField icon={Phone} label="Phone" value={department.phone_number} iconColor="text-green-500" />
      )}
    </div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);

const ContactField = ({ icon: Icon, label, value, iconColor }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span>{value}</span>
    </div>
  </div>
);

export default DepartmentsForm;