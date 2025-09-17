import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../page/Home';

const HomePage = () => <h2>Home Page</h2>;
const AboutPage = () => <h2>About Page</h2>;
const NotFoundPage = () => <h2>404 - Not Found</h2>;

const MakaraRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default MakaraRouter;
