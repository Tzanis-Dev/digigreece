import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/assessment" element={<Assessment />} />
    </Routes>
  );
}

export default App;