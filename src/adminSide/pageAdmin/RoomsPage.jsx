import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RoomForm from "../ConponentsAdmin/RoomForm.jsx";
import RoomsList from "../ConponentsAdmin/RoomsList.jsx";
import FormModal from "../../Components/FormModal.jsx";
import { fetchAllRooms } from "../../api/room_api.jsx";
import { fetchBuildingOptions } from "../../api/building_api.jsx";
import { DoorOpen, Building, Hash, Users } from "lucide-react";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
    loadBuildings();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await fetchAllRooms();
      const data = res.data?.data || res.data || [];
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async () => {
    try {
      const res = await fetchBuildingOptions();
      const data = res.data?.data || res.data || [];
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load buildings:", error);
      setBuildings([]);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    loadRooms();
    setEditingRoom(null);
  };

  const handleCancel = () => {
    setEditingRoom(null);
  };

  const availableRooms = rooms.filter((r) => r.is_available).length;
  const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
  const uniqueBuildings = new Set(rooms.map((r) => r.building_id)).size;

  const quickStats = [
    {
      label: "Total Rooms",
      value: rooms.length,
      color: "from-blue-500 to-cyan-500",
      icon: DoorOpen,
    },
    {
      label: "Available Rooms",
      value: availableRooms,
      color: "from-green-500 to-emerald-500",
      icon: Building,
    },
    {
      label: "Total Capacity",
      value: totalCapacity,
      color: "from-purple-500 to-pink-500",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-600 font-medium">Manage campus rooms and teaching spaces.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingRoom(null);
            setIsFormOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <DoorOpen className="w-4 h-4" />
          Add Room
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
          setEditingRoom(null);
        }}
      >
        <RoomForm
          editingRoom={editingRoom}
          onSuccess={() => {
            handleSuccess();
            setIsFormOpen(false);
          }}
          onCancel={() => {
            handleCancel();
            setIsFormOpen(false);
          }}
          onUpdate={loadRooms}
          buildings={buildings}
        />
      </FormModal>

      {/* List */}
      <RoomsList rooms={rooms} onEdit={handleEdit} onRefresh={loadRooms} />
    </div>
  );
};

export default RoomsPage;