import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home    from './pages/Home'
import Project from './pages/Project/index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
