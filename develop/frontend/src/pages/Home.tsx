import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Spinner, FilePicker } from '@pergola/engine'
import { Input, Textarea } from '@pergola/engine'
import { api } from '../lib/api'
import type { Project } from '../lib/api'

type ModalMode = 'open' | 'create'

export default function Home() {
  const navigate   = useNavigate()
  const [projects, setProjects]     = useState<Project[]>([])
  const [loading,  setLoading]      = useState(true)
  const [modal,    setModal]        = useState<ModalMode | null>(null)
  const [path,     setPath]         = useState('')
  const [appName,  setAppName]      = useState('')
  const [appDesc,  setAppDesc]      = useState('')
  const [busy,     setBusy]         = useState(false)
  const [error,    setError]        = useState('')

  useEffect(() => {
    api.status().then(s => {
      if (s.open) { navigate('/project'); return }
      api.projects().then(setProjects).finally(() => setLoading(false))
    })
  }, [navigate])

  function openModal(mode: ModalMode) {
    setModal(mode); setPath(''); setAppName(''); setAppDesc(''); setError('')
  }
  function closeModal() { if (!busy) setModal(null) }

  async function openProject(p: Project) {
    await api.setPath(p.path)
    await api.addProject(p.name, p.path)
    navigate('/project')
  }

  async function handleAction() {
    if (!path) return
    setBusy(true); setError('')
    try {
      if (modal === 'open') {
        const name = path.split('/').filter(Boolean).pop() ?? path
        await api.setPath(path)
        await api.addProject(name, path)
      } else {
        if (!appName.trim()) { setError('App name is required'); setBusy(false); return }
        await api.createApp(appName.trim(), appDesc.trim(), path)
      }
      navigate('/project')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setBusy(false)
    }
  }

  const folderName = appName.trim().replace(/ /g, '_') || '…'
  const previewPath = modal === 'create' && path ? `${path}/${folderName}` : path

  const canSubmit = modal === 'create' ? (!!path && !!appName.trim()) : !!path

  return (
    <div className="pgl-launch">
      <div className="pgl-launch-card">
        <div className="pgl-launch-card__brand">pergola</div>

        <div className="pgl-launch-card__body">
          <p className="pgl-recent__label">Recent</p>
          {loading
            ? <div className="pgl-recent__empty"><Spinner size="sm" /></div>
            : projects.length === 0
              ? <div className="pgl-recent__empty">No recent projects</div>
              : projects.map(p => (
                  <button key={p.path} className="pgl-recent__item" onClick={() => openProject(p)}>
                    <svg className="pgl-recent__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <div className="pgl-recent__item-info">
                      <span className="pgl-recent__item-name">{p.name}</span>
                      <span className="pgl-recent__item-path">{p.path}</span>
                    </div>
                    <svg className="pgl-recent__item-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ))
          }
        </div>

        <div className="pgl-launch-card__footer">
          <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openModal('open')}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>}>
            Open folder
          </Button>
          <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openModal('create')}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>}>
            New app
          </Button>
        </div>
      </div>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal === 'create' ? 'New app' : 'Open folder'}
        width={560}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <span style={{ flex: 1, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {previewPath}
            </span>
            {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
            <Button variant="ghost" size="sm" onClick={closeModal} disabled={busy}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleAction} disabled={!canSubmit} loading={busy}>
              {modal === 'create' ? 'Create app' : 'Open'}
            </Button>
          </div>
        }
      >
        {modal === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <Input
              placeholder="App name"
              value={appName}
              onChange={setAppName}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAction()}
            />
            <Textarea
              placeholder="Describe your app…"
              value={appDesc}
              onChange={setAppDesc}
              rows={2}
            />
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted2)' }}>
              Choose parent folder
            </p>
          </div>
        )}
        <div style={{ height: modal === 'create' ? 240 : 340, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <FilePicker
            onBrowse={p => api.browse(p)}
            onSelect={setPath}
          />
        </div>
      </Modal>
    </div>
  )
}
