import React from "react";
import Curriculum from "../page/Curriculum";
import CurriculumDetail from "../page/CurriculumDetail";
import StudentLifecycleTracker from "../Dashboard/ManageStudents/index.jsx";
import { Route } from "react-router-dom";

const MonyRoutes = () => [
  <Route key="curriculum" path="/curriculum" element={<Curriculum />} />,
  <Route key="curriculumdetail" path="/curriculumdetail" element={<CurriculumDetail />} />,
  <Route key="managestudent" path="/managestudent" element={<StudentLifecycleTracker />} />,
];

export default MonyRoutes;
