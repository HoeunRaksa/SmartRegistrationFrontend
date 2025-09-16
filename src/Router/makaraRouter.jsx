import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Example pages (replace with your actual components)
const HomePage = () => <h2>Home Page</h2>;
const AboutPage = () => <h2>About Page</h2>;
const NotFoundPage = () => <h2>404 - Not Found</h2>;

const MakaraRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
);

export default MakaraRouter;