import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Serve renders pergola layouts using the engine renderer — no editor UI.
// Pages will be added as serve functionality is built out.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>pergola serve</span>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Runtime coming soon.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
