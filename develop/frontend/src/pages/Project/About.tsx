import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@pergola/engine'
import { api } from '../../lib/api'

export default function About() {
  const navigate = useNavigate()
  const [meta, setMeta]     = useState<{ name: string; version: string; description: string } | null>(null)
  const [path, setPath]     = useState('')

  useEffect(() => {
    api.status().then(s => {
      if (!s.open) return
      setMeta(s.meta ?? null)
      setPath(s.path ?? '')
    })
  }, [])

  async function close() {
    await api.closeApp()
    navigate('/')
  }

  return (
    <div>
      <div className="pgl-section-header">
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>About</h2>
      </div>

      <div className="pgl-about-grid">
        <div className="pgl-about-row"><span className="pgl-about-key">Name</span>        <span className="pgl-about-val">{meta?.name ?? '…'}</span></div>
        <div className="pgl-about-row"><span className="pgl-about-key">Version</span>     <span className="pgl-about-val">{meta?.version ?? '…'}</span></div>
        <div className="pgl-about-row"><span className="pgl-about-key">Description</span> <span className="pgl-about-val">{meta?.description || '—'}</span></div>
        <div className="pgl-about-row"><span className="pgl-about-key">Path</span>        <span className="pgl-about-val pgl-about-val--mono">{path || '…'}</span></div>
      </div>

      <div className="pgl-about-actions">
        <Button variant="danger" onClick={close}
          icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}>
          Close project
        </Button>
      </div>
    </div>
  )
}
