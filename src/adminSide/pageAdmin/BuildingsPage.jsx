import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BuildingForm from "../ConponentsAdmin/BuildingForm.jsx";
import BuildingsList from "../ConponentsAdmin/BuildingsList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchAllBuildings } from "../../api/building_api.jsx";
import { Building, MapPin, Hash } from "lucide-react";

const BuildingsPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const res = await fetchAllBuildings();
      const data = res.data?.data || res.data || [];
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load buildings:", error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    loadBuildings();
    setEditingBuilding(null);
  };

  const handleCancel = () => {
    setEditingBuilding(null);
  };

  const activeBuildings = buildings.filter((b) => b.is_active).length;
  const totalRooms = buildings.reduce((sum, b) => sum + (b.rooms_count || 0), 0);

  const quickStats = [
    {
      label: "Total Buildings",
      value: buildings.length,
      color: "from-blue-500 to-cyan-500",
      icon: Building,
    },
    {
      label: "Active Buildings",
      value: activeBuildings,
      color: "from-green-500 to-emerald-500",
      icon: MapPin,
    },
    {
      label: "Total Rooms",
      value: totalRooms,
      color: "from-purple-500 to-pink-500",
      icon: Hash,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
          <p className="text-sm text-gray-600 font-medium">Manage university campus buildings and assets.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingBuilding(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Building className="w-4 h-4" />
          Add Building
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "…" : stat.value}
                  </p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBuilding(null);
        }}
      >
        <BuildingForm
          editingBuilding={editingBuilding}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
          onUpdate={loadBuildings}
        />
      </FormModal>

      {/* List */}
      <BuildingsList
        buildings={buildings}
        onEdit={handleEdit}
        onRefresh={loadBuildings}
      />
    </div>
  );
};

export default BuildingsPage;