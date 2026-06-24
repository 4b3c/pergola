import React, { useState, useCallback } from 'react'

export interface BrowseResult {
  path: string
  breadcrumbs: { name: string; path: string }[]
  dirs: { name: string; path: string }[]
}

export interface FilePickerProps {
  onBrowse: (path: string) => Promise<BrowseResult>
  initialPath?: string
  onSelect?: (path: string) => void
}

export function FilePicker({ onBrowse, initialPath = '~', onSelect }: FilePickerProps) {
  const [result, setResult] = useState<BrowseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const browse = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await onBrowse(path)
      setResult(data)
      onSelect?.(data.path)
    } catch {
      setError('Could not load directory')
    } finally {
      setLoading(false)
    }
  }, [onBrowse, onSelect])

  // Load initial path on mount
  React.useEffect(() => { browse(initialPath) }, [])

  return (
    <div className="pgl-fp">
      <div className="pgl-fp__breadcrumbs">
        {result?.breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            <button className="pgl-breadcrumb__item" onClick={() => browse(crumb.path)}>
              {crumb.name}
            </button>
            {i < (result.breadcrumbs.length - 1) && <span className="pgl-breadcrumb__sep">/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="pgl-fp__list">
        {loading && <div className="pgl-fp__empty">loading…</div>}
        {error   && <div className="pgl-fp__empty" style={{ color: 'var(--danger)' }}>{error}</div>}
        {!loading && !error && result?.dirs.length === 0 && (
          <div className="pgl-fp__empty">No subfolders</div>
        )}
        {!loading && !error && result?.dirs.map(dir => (
          <button key={dir.path} className="pgl-fp__item" onClick={() => browse(dir.path)}>
            <svg className="pgl-fp__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
            </svg>
            <span className="pgl-fp__item-name">{dir.name}</span>
            <svg className="pgl-fp__item-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
