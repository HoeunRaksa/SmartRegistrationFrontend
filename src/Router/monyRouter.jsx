import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Curriculum from '../page/Curriculum';
import CurriculumDetail from '../page/CurriculumDetail';

const MonyRouter = () => (
        <Routes>
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculumdetail" element={<CurriculumDetail />} />
        </Routes>
);

export default MonyRouter;