import { motion, AnimatePresence } from "framer-motion";
import { deleteMajor } from "../../api/major_api.jsx";
import {
  GraduationCap,
  X,
  Grid3x3,
  Trash2,
  Edit,
  Building2,
  BookOpen,
} from "lucide-react";

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

const MajorsList = ({ majors, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this major?")) return;

    try {
      await deleteMajor(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete major:", err);
      alert(err.response?.data?.message || "Failed to delete major");
    }
  };

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Majors</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-semibold">
          {majors.length} Total
        </span>
      </div>

      {majors.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {majors.map((major) => (
            <MajorCard
              key={major.id}
              major={major}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <GraduationCap className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No majors yet</p>
    <p className="text-sm text-gray-400 mt-1">Create your first major to get started</p>
  </motion.div>
);

const MajorCard = ({ major, onEdit, onDelete }) => {
  // Use the same API URL as your API configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const imageUrl = major.image
    ? `${API_BASE_URL}/${major.image}`
    : null;

  return (
    <motion.div
      variants={animations.card}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-xl bg-white/60 border border-white/50 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <MajorCardHeader
        major={major}
        imageUrl={imageUrl}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <MajorCardContent major={major} />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

const MajorCardHeader = ({ major, imageUrl, onEdit, onDelete }) => (
  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={major.major_name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to icon if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : null}

    <div
      className="w-full h-full flex items-center justify-center"
      style={{ display: imageUrl ? 'none' : 'flex' }}
    >
      <GraduationCap className="w-16 h-16 text-purple-300" />
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/90 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(major);
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
          onDelete(major.id);
        }}
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </motion.button>
    </div>
  </div>
);

const MajorCardContent = ({ major }) => (
  <div className="p-5">
    <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600">
      {major.major_name}
    </h4>

    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
        <Building2 className="w-3 h-3" />
        {major.department?.name || ""}
      </span>
    </div>

    {major.description && (
      <p className="text-xs text-gray-600 line-clamp-3 mb-3">{major.description}</p>
    )}

    <div className="pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <BookOpen className="w-3.5 h-3.5 text-purple-500" />
        <span>Department: {major.department?.code || ""}</span>
      </div>
    </div>
  </div>
);

export default MajorsList;