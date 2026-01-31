import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBuilding, updateBuilding } from "../../api/building_api.jsx";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  Hash,
  MapPin,
  FileText,
  Layers,
} from "lucide-react";
import Alert from "../../gobalConponent/Alert";

const INITIAL_FORM_STATE = {
  building_code: "",
  building_name: "",
  description: "",
  location: "",
  total_floors: 1,
  is_active: true,
};

const BuildingForm = ({ onUpdate, onSuccess, editingBuilding, onCancel }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const isEditMode = !!editingBuilding;

  useEffect(() => {
    if (editingBuilding) {
      setForm({
        building_code: editingBuilding.building_code ?? "",
        building_name: editingBuilding.building_name ?? "",
        description: editingBuilding.description ?? "",
        location: editingBuilding.location ?? "",
        total_floors: editingBuilding.total_floors ?? 1,
        is_active: editingBuilding.is_active ?? true,
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingBuilding]);

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setAlert({ show: false, message: "", type: "success" });
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setAlert({ ...alert, show: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ ...alert, show: false });

    try {
      const submitData = {
        building_code: form.building_code.trim(),
        building_name: form.building_name.trim(),
        description: form.description?.trim() || null,
        location: form.location?.trim() || null,
        total_floors: parseInt(form.total_floors, 10),
        is_active: form.is_active,
      };

      if (!submitData.building_code) {
        setAlert({ show: true, message: "Building code is required", type: "error" });
        setLoading(false);
        return;
      }

      if (!submitData.building_name) {
        setAlert({ show: true, message: "Building name is required", type: "error" });
        setLoading(false);
        return;
      }

      if (isEditMode) {
        await updateBuilding(editingBuilding.id, submitData);
      } else {
        await createBuilding(submitData);
      }

      resetForm();
      setAlert({
        show: true,
        message: `Building ${isEditMode ? "updated" : "created"} successfully!`,
        type: "success"
      });

      if (onSuccess) onSuccess();
      if (onUpdate) onUpdate();
    } catch (err) {
      let errorMessage = "Failed to save building";
      if (err.response?.data) {
        const data = err.response.data;
        if (data.errors) errorMessage = Object.values(data.errors).flat().join(", ");
        else if (data.message) errorMessage = data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setAlert({ show: true, message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-white border border-white shadow-lg p-5"
      >
        <FormHeader isEditMode={isEditMode} onCancel={resetForm} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Building Code */}
            <FieldInput
              icon={Hash}
              name="building_code"
              value={form.building_code}
              onChange={handleChange}
              placeholder="Building Code (e.g., A, B, MAIN)"
              required
              maxLength={10}
            />

            {/* Building Name */}
            <FieldInput
              icon={Building}
              name="building_name"
              value={form.building_name}
              onChange={handleChange}
              placeholder="Building Name"
              required
            />
          </div>

          {/* Location */}
          <FieldInput
            icon={MapPin}
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g., North Campus)"
          />

          {/* Description */}
          <FieldTextarea
            icon={FileText}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Total Floors */}
            <FieldInput
              icon={Layers}
              name="total_floors"
              type="number"
              value={form.total_floors}
              onChange={handleChange}
              placeholder="Total Floors"
              min={1}
              max={50}
            />

            {/* Is Active */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-purple-200/60">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-900 font-medium">Active</label>
            </div>
          </div>

          <SubmitButton loading={loading} isEditMode={isEditMode} />
        </form>
      </motion.div>
    </div>
  );
};

const FormHeader = ({ isEditMode, onCancel }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-600" />
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditMode ? "Edit Building" : "Create New Building"}
      </h2>
    </div>
    {isEditMode && (
      <button
        onClick={onCancel}
        type="button"
        className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    )}
  </div>
);

const FieldInput = ({ icon: Icon, name, value, onChange, placeholder, type = "text", required, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl bg-white pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
      {...props}
    />
  </div>
);

const FieldTextarea = ({ icon: Icon, name, value, onChange, placeholder, rows = 3 }) => (
  <div className="relative">
    <div className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
    />
  </div>
);

const SubmitButton = ({ loading, isEditMode }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    type="submit"
    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
          {isEditMode ? "Updating Building..." : "Saving Building..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Building" : "Create Building"}
        </>
      )}
    </span>
  </motion.button>
);

export default BuildingForm;