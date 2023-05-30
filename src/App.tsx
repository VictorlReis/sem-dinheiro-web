import { Routes, Route, HashRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import React from 'react';

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
