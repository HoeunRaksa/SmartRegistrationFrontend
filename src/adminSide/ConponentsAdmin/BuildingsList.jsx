import { motion } from "framer-motion";
import { deleteBuilding } from "../../api/building_api.jsx";
import { Building, Trash2, Edit, Hash, MapPin, Layers, CheckCircle, XCircle } from "lucide-react";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import Alert from "../../gobalConponent/Alert.jsx";
import { useState } from "react";

const BuildingsList = ({ buildings, onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleDelete = (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteBuilding(confirm.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete building:", err);
      setAlert({
        show: true,
        message: err.response?.data?.message || "Failed to delete building",
        type: "error"
      });
    } finally {
      setConfirm({ show: false, id: null });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden relative"
    >
      <Alert
        isOpen={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Buildings</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {buildings.length} Total
        </span>
      </div>

      {buildings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Floors</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buildings.map((building, index) => (
                <BuildingRow
                  key={building.id}
                  building={building}
                  index={index}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirm.show}
        title="Confirm Delete"
        message="Are you sure you want to delete this building? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Building className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No buildings yet</p>
    <p className="text-sm text-gray-400 mt-1">Create buildings to organize rooms</p>
  </div>
);

const BuildingRow = ({ building, index, onEdit, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="hover:bg-blue-50/30 transition-colors"
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <Hash className="w-4 h-4 text-gray-400 mr-1" />
        <span className="text-sm font-medium text-gray-900">{index + 1}</span>
      </div>
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
        {building.building_code}
      </span>
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
          <Building className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-sm font-semibold text-gray-900">{building.building_name}</div>
      </div>
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      {building.location ? (
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span>{building.location}</span>
        </div>
      ) : (
        <span className="text-xs text-gray-400">-</span>
      )}
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-1 text-sm text-gray-900">
        <Layers className="w-3 h-3 text-gray-400" />
        <span>{building.total_floors || 0}</span>
      </div>
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm font-medium text-gray-900">{building.rooms_count || 0}</span>
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      {building.is_active ? (
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
          <XCircle className="w-3 h-3" />
          Inactive
        </span>
      )}
    </td>

    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center justify-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(building)}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
          title="Edit Building"
        >
          <Edit className="w-4 h-4 text-blue-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(building.id)}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
          title="Delete Building"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

export default BuildingsList;