import { useContext } from 'react'
import { EditorContext } from './LayoutEditor'
import { COMPONENT_DEFS } from './componentDefs'
import type { PropDef } from './types'

const GROUP_ORDER = ['content', 'layout', 'typography', 'background', 'border', 'effects'] as const
const GROUP_LABELS: Record<string, string> = {
  content: 'Content', layout: 'Layout', typography: 'Typography',
  background: 'Background', border: 'Border', effects: 'Effects',
}

export function PropertyPanel() {
  const { state, dispatch } = useContext(EditorContext)!
  const { selectedId, layout } = state

  if (!selectedId) {
    return (
      <aside className="editor-properties">
        <div className="prop-empty">Select a component on the canvas to edit its properties.</div>
      </aside>
    )
  }

  // Find selected node
  function findNode(root: any, id: string): any {
    if (root.id === id) return root
    for (const c of root.children ?? []) { const f = findNode(c, id); if (f) return f }
    return null
  }
  const node = findNode(layout.root, selectedId)
  if (!node) return null

  const def = COMPONENT_DEFS[node.type]
  if (!def) return null

  const propDefs = def.propDefs ?? []

  // Group props
  const groups: Record<string, PropDef[]> = {}
  for (const pd of propDefs) {
    const g = pd.group ?? 'content'
    groups[g] = [...(groups[g] ?? []), pd]
  }

  function setProp(key: string, value: unknown) {
    dispatch({ type: 'UPDATE_PROPS', id: selectedId!, props: { [key]: value } })
  }
  function setContent(value: string) {
    dispatch({ type: 'UPDATE_CONTENT', id: selectedId!, content: value })
  }

  function renderInput(pd: PropDef) {
    const val = pd.isContent ? node.content : node.props[pd.key]

    if (pd.type === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={!!val}
          onChange={e => pd.isContent ? setContent(String(e.target.checked)) : setProp(pd.key, e.target.checked)}
          style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }}
        />
      )
    }

    if (pd.type === 'select') {
      return (
        <select
          className="prop-input"
          value={String(val ?? '')}
          onChange={e => pd.isContent ? setContent(e.target.value) : setProp(pd.key, e.target.value)}
        >
          <option value="">—</option>
          {pd.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    }

    if (pd.type === 'color') {
      const strVal = String(val ?? '')
      // Only show color picker for hex values; always show text input
      const isHex = /^#[0-9a-fA-F]{3,8}$/.test(strVal)
      return (
        <div className="prop-color-row">
          <input
            type="text"
            className="prop-input"
            value={strVal}
            placeholder="var(--text)"
            onChange={e => setProp(pd.key, e.target.value)}
          />
          {isHex && (
            <input
              type="color"
              className="prop-input prop-input--color"
              value={strVal.length === 7 ? strVal : '#000000'}
              onChange={e => setProp(pd.key, e.target.value)}
            />
          )}
        </div>
      )
    }

    if (pd.type === 'textarea') {
      return (
        <textarea
          className="prop-input prop-input--textarea"
          value={String(val ?? '')}
          onChange={e => pd.isContent ? setContent(e.target.value) : setProp(pd.key, e.target.value)}
          rows={3}
        />
      )
    }

    if (pd.type === 'number') {
      return (
        <input
          type="number"
          className="prop-input"
          value={val != null ? String(val) : ''}
          min={pd.min}
          max={pd.max}
          step={pd.step ?? 1}
          placeholder="—"
          onChange={e => {
            const n = e.target.value === '' ? undefined : Number(e.target.value)
            setProp(pd.key, n)
          }}
        />
      )
    }

    // default: text
    return (
      <input
        type="text"
        className="prop-input"
        value={String(val ?? '')}
        placeholder="—"
        onChange={e => pd.isContent ? setContent(e.target.value) : setProp(pd.key, e.target.value)}
      />
    )
  }

  return (
    <aside className="editor-properties">
      <div className="prop-panel-header">
        Properties
        <span className="prop-panel-type">{node.type}</span>
      </div>

      {GROUP_ORDER.filter(g => groups[g]?.length).map(g => (
        <div key={g} className="prop-group">
          <p className="prop-group-label">{GROUP_LABELS[g]}</p>
          {groups[g].map(pd => (
            <div key={pd.key} className="prop-row">
              <span className="prop-label">{pd.label}</span>
              {renderInput(pd)}
            </div>
          ))}
        </div>
      ))}

      {selectedId !== 'root' && (
        <button
          className="prop-delete-btn"
          onClick={() => dispatch({ type: 'DELETE_NODE', id: selectedId })}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete component
        </button>
      )}
    </aside>
  )
}
