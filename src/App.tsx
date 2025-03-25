import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CareerRoadmap from './pages/CareerRoadmap';
import JobSearch from './pages/JobSearch';
import LearningHub from './pages/LearningHub';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CareerInsights from './pages/CareerInsights';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CareerRoadmap />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/insights" element={<CareerInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;