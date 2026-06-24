import React from 'react'
import { EmptyState } from '@pergola/engine'

export default function Scripts() {
  return (
    <div>
      <div className="pgl-section-header">
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Scripts</h2>
      </div>
      <EmptyState
        icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
        title="No scripts yet"
        body="Scripts run on the server and can read from and write to your databases."
      />
    </div>
  )
}
