import React from 'react'
import { EmptyState } from '@pergola/engine'

export default function Layouts() {
  return (
    <div>
      <div className="pgl-section-header">
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Layouts</h2>
      </div>
      <EmptyState
        icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
        title="No layouts yet"
        body="Layouts let you build drag-and-drop interfaces that connect to your databases."
      />
    </div>
  )
}
