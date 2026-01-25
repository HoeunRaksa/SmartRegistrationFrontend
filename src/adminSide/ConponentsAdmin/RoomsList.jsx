import { motion } from "framer-motion";
import { deleteRoom } from "../../api/room_api.jsx";
import {
  DoorOpen,
  Trash2,
  Edit,
  Hash,
  Building,
  Users,
  Layers,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";

const RoomsList = ({ rooms, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoom(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Rooms</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {rooms.length} Total
        </span>
      </div>

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Building</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Facilities</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room, index) => (
                <RoomRow key={room.id} room={room} index={index} onEdit={onEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <DoorOpen className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No rooms yet</p>
    <p className="text-sm text-gray-400 mt-1">Create rooms in buildings</p>
  </div>
);

const RoomRow = ({ room, index, onEdit, onDelete }) => {
  const typeColors = {
    classroom: "blue",
    lab: "purple",
    lecture_hall: "green",
    seminar_room: "orange",
    computer_lab: "pink",
    library: "yellow",
    office: "red",
    other: "gray",
  };

  const typeColor = typeColors[room.room_type] || "gray";

  return (
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
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <Building className="w-3 h-3 text-gray-400" />
          <span className="font-medium">{room.building_code || "-"}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
            <DoorOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{room.full_name || room.room_number}</div>
            {room.room_name && <div className="text-xs text-gray-500">{room.room_name}</div>}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 text-xs bg-${typeColor}-100 text-${typeColor}-600 px-2.5 py-1 rounded-full font-medium`}
        >
          <Tag className="w-3 h-3" />
          {room.room_type.replace("_", " ")}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <Users className="w-3 h-3 text-gray-400" />
          <span>{room.capacity || 0}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900">
          <Layers className="w-3 h-3 text-gray-400" />
          <span>{room.floor ?? 0}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        {room.facilities && room.facilities.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {room.facilities.slice(0, 3).map((facility, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {facility}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="text-xs text-gray-400">+{room.facilities.length - 3}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {room.is_available ? (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            Unavailable
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(room)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Room"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(room.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Room"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default RoomsList;