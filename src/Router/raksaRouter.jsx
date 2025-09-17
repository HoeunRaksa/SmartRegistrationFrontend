import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Example pages (replace with your actual components)
const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

const RaksaRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
);

export default RaksaRouter;