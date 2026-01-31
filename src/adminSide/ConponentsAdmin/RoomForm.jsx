import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoom, updateRoom } from "../../api/room_api.jsx";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DoorOpen,
  Hash,
  Building,
  Users,
  Layers,
  FileText,
  Tag,
} from "lucide-react";
import Alert from "../../gobalConponent/Alert";

const INITIAL_FORM_STATE = {
  building_id: "",
  room_number: "",
  room_name: "",
  room_type: "classroom",
  capacity: 30,
  floor: 1,
  facilities: [],
  is_available: true,
};

const ROOM_TYPES = [
  { id: "classroom", name: "Classroom" },
  { id: "lab", name: "Laboratory" },
  { id: "lecture_hall", name: "Lecture Hall" },
  { id: "seminar_room", name: "Seminar Room" },
  { id: "computer_lab", name: "Computer Lab" },
  { id: "library", name: "Library" },
  { id: "office", name: "Office" },
  { id: "other", name: "Other" },
];

const FACILITY_OPTIONS = [
  "Projector",
  "Whiteboard",
  "AC",
  "Sound System",
  "Computers",
  "Lab Equipment",
  "WiFi",
  "Smart Board",
];

const RoomForm = ({ onUpdate, onSuccess, editingRoom, onCancel, buildings }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const isEditMode = !!editingRoom;

  useEffect(() => {
    if (editingRoom) {
      setForm({
        building_id: editingRoom.building_id ?? "",
        room_number: editingRoom.room_number ?? "",
        room_name: editingRoom.room_name ?? "",
        room_type: editingRoom.room_type ?? "classroom",
        capacity: editingRoom.capacity ?? 30,
        floor: editingRoom.floor ?? 1,
        facilities: Array.isArray(editingRoom.facilities) ? editingRoom.facilities : [],
        is_available: editingRoom.is_available ?? true,
      });
    } else {
      setForm(INITIAL_FORM_STATE);
    }
  }, [editingRoom]);

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

  const handleFacilityToggle = (facility) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ ...alert, show: false });

    try {
      const submitData = {
        building_id: parseInt(form.building_id, 10),
        room_number: form.room_number.trim(),
        room_name: form.room_name?.trim() || null,
        room_type: form.room_type,
        capacity: parseInt(form.capacity, 10),
        floor: parseInt(form.floor, 10),
        facilities: form.facilities,
        is_available: form.is_available,
      };

      if (!submitData.building_id || isNaN(submitData.building_id)) {
        setAlert({ show: true, message: "Please select a building", type: "error" });
        setLoading(false);
        return;
      }

      if (!submitData.room_number) {
        setAlert({ show: true, message: "Room number is required", type: "error" });
        setLoading(false);
        return;
      }

      if (isEditMode) {
        await updateRoom(editingRoom.id, submitData);
      } else {
        await createRoom(submitData);
      }

      resetForm();
      setAlert({
        show: true,
        message: `Room ${isEditMode ? "updated" : "created"} successfully!`,
        type: "success"
      });

      if (onSuccess) onSuccess();
      if (onUpdate) onUpdate();
    } catch (err) {
      let errorMessage = "Failed to save room";
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

  const buildingOptions = Array.isArray(buildings)
    ? buildings.map((b) => ({
      id: b.id,
      name: b.label || `${b.code} - ${b.name}`,
    }))
    : [];

  return (
    <div className="space-y-4">
      <div className="z-50 container mx-auto flex justify-center sticky top-0 h-0">
        <div className="w-full max-w-md mt-4">
          <Alert
            show={alert.show}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-white border border-white shadow-lg p-5"
      >
        <FormHeader isEditMode={isEditMode} onCancel={resetForm} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Building */}
            <FieldSelect
              icon={Building}
              name="building_id"
              value={form.building_id}
              onChange={handleChange}
              placeholder="Select Building"
              options={buildingOptions}
              required
            />

            {/* Room Number */}
            <FieldInput
              icon={Hash}
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              placeholder="Room Number (e.g., 101, LAB-1)"
              required
              maxLength={20}
            />
          </div>

          {/* Room Name */}
          <FieldInput
            icon={FileText}
            name="room_name"
            value={form.room_name}
            onChange={handleChange}
            placeholder="Room Name (optional, e.g., Computer Lab 1)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Room Type */}
            <FieldSelect
              icon={Tag}
              name="room_type"
              value={form.room_type}
              onChange={handleChange}
              placeholder="Room Type"
              options={ROOM_TYPES}
              required
            />

            {/* Capacity */}
            <FieldInput
              icon={Users}
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              min={1}
              max={500}
            />

            {/* Floor */}
            <FieldInput
              icon={Layers}
              name="floor"
              type="number"
              value={form.floor}
              onChange={handleChange}
              placeholder="Floor"
              min={0}
              max={50}
            />
          </div>

          {/* Facilities */}
          <div className="p-4 rounded-xl bg-white/70 border border-purple-200/60">
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              Facilities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {FACILITY_OPTIONS.map((facility) => (
                <label
                  key={facility}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${form.facilities.includes(facility)
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-200"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={form.facilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Is Available */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-purple-200/60">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-900 font-medium">Available for scheduling</label>
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
        {isEditMode ? "Edit Room" : "Create New Room"}
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
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
      {...props}
    />
  </div>
);

const FieldSelect = ({ icon: Icon, name, value, onChange, placeholder, options, required }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      required={!!required}
      className="w-full rounded-xl bg-white/70 pl-10 pr-3 py-2 text-sm text-gray-900 border border-purple-200/60 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
    >
      <option value="">{placeholder}</option>
      {(Array.isArray(options) ? options : []).map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
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
          {isEditMode ? "Updating Room..." : "Saving Room..."}
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {isEditMode ? "Update Room" : "Create Room"}
        </>
      )}
    </span>
  </motion.button>
);

export default RoomForm;