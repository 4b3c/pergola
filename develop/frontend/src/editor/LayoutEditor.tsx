import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useEditor } from './useEditor'
import { ComponentPalette } from './ComponentPalette'
import { EditorCanvas } from './EditorCanvas'
import { PropertyPanel } from './PropertyPanel'
import { Button } from '@pergola/engine'
import { api } from '../lib/api'
import type { EditorState, EditorAction } from './types'
import './editor.css'

// ── Context shared by all editor sub-components ───────────────────────────────
export interface EditorContextValue {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  dragType: string | null
  setDragType: (t: string | null) => void
}
export const EditorContext = createContext<EditorContextValue | null>(null)

// ── LayoutEditor ──────────────────────────────────────────────────────────────
interface Props {
  layoutName: string
  onBack: () => void
}

export function LayoutEditor({ layoutName, onBack }: Props) {
  const { state, dispatch }     = useEditor()
  const [dragType, setDragType] = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [saveMsg, setSaveMsg]   = useState<string | null>(null)
  const saveTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load layout on mount
  useEffect(() => {
    ;(api as any).getLayout(layoutName).then((layout: any) => {
      dispatch({ type: 'LOAD', layout })
    })
  }, [layoutName])

  // Auto-save after 1.5s of inactivity
  useEffect(() => {
    if (!state.dirty) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(), 1500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [state.layout, state.dirty])

  const save = useCallback(async () => {
    if (!state.dirty && saving) return
    setSaving(true)
    try {
      await (api as any).saveLayout(layoutName, state.layout)
      dispatch({ type: 'MARK_SAVED' })
      setSaveMsg('Saved')
      setTimeout(() => setSaveMsg(null), 2000)
    } catch {
      setSaveMsg('Error saving')
    } finally {
      setSaving(false)
    }
  }, [state.layout, state.dirty, layoutName])

  return (
    <EditorContext.Provider value={{ state, dispatch, dragType, setDragType }}>
      <div className="editor-wrap">
        <div className="editor-topbar">
          <Button variant="ghost" size="xs" onClick={onBack}
            icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>}>
            Layouts
          </Button>
          <span className="editor-title">{state.layout.name || layoutName}</span>
          {saveMsg && (
            <span style={{ fontSize: 11, color: saveMsg === 'Saved' ? 'var(--success)' : 'var(--danger)' }}>
              {saveMsg}
            </span>
          )}
          {state.dirty && !saving && (
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Unsaved changes</span>
          )}
          <Button variant="primary" size="xs" onClick={save} loading={saving}
            icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}>
            Save
          </Button>
        </div>

        <div className="editor-body">
          <ComponentPalette />
          <EditorCanvas />
          <PropertyPanel />
        </div>
      </div>
    </EditorContext.Provider>
  )
}
