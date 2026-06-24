import { useEffect, useRef, useState } from 'react'
import { Button, EmptyState, Spinner } from '@pergola/engine'
import { api } from '../../lib/api'
import { LayoutEditor } from '../../editor/LayoutEditor'
import type { LayoutMeta } from '../../lib/api'

const LAYOUT_ICON = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
)

export default function Layouts() {
  const [layouts,  setLayouts]  = useState<LayoutMeta[]>([])
  const [loading,  setLoading]  = useState(true)
  const [active,   setActive]   = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [newName,  setNewName]  = useState('')
  const [formErr,  setFormErr]  = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    ;(api as any).layouts().then(setLayouts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (showForm) setTimeout(() => inputRef.current?.focus(), 50) }, [showForm])

  async function create() {
    if (!newName.trim()) return
    try {
      await (api as any).createLayout(newName.trim())
      setShowForm(false); setNewName(''); setFormErr('')
      load()
    } catch (e: unknown) {
      setFormErr(e instanceof Error ? e.message : 'Error')
    }
  }

  // Open layout in full-screen editor
  if (active) {
    return <LayoutEditor layoutName={active} onBack={() => { setActive(null); load() }} />
  }

  return (
    <div>
      <div className="pgl-section-header">
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Layouts</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}
          icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>}>
          New layout
        </Button>
      </div>

      {showForm && (
        <div className="pgl-inline-form pgl-inline-form--visible">
          <input
            ref={inputRef}
            className="pgl-inline-input"
            placeholder="layout name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') create(); if (e.key === 'Escape') { setShowForm(false); setNewName('') } }}
          />
          <Button variant="primary" size="xs" onClick={create}>Create</Button>
          <Button variant="ghost"   size="xs" onClick={() => { setShowForm(false); setNewName('') }}>Cancel</Button>
          {formErr && <span className="pgl-inline-error">{formErr}</span>}
        </div>
      )}

      {loading
        ? <EmptyState icon={<Spinner />} />
        : layouts.length === 0
          ? <EmptyState icon={LAYOUT_ICON} title="No layouts yet"
              body="Layouts define what your app's pages look like. Create one to start building." />
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 8 }}>
              {layouts.map(l => (
                <button
                  key={l.name}
                  onDoubleClick={() => setActive(l.name)}
                  onClick={() => setActive(l.name)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '20px 16px', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.14s, background 0.14s',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ color: 'var(--accent)', opacity: 0.7 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{l.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{l.file}</span>
                </button>
              ))}
            </div>
      }
    </div>
  )
}
