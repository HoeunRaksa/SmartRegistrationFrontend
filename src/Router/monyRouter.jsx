import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Curriculum from '../page/Curriculum';
import CurriculumDetail from '../page/CurriculumDetail';
import StudentLifecycleTracker from "../Dashboard/ManageStudents/index.jsx";

const MonyRouter = () => (
        <Routes>
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculumdetail" element={<CurriculumDetail />} />
            <Route path="/managestudent" element={<StudentLifecycleTracker />} />
        </Routes>
);

export default MonyRouter;