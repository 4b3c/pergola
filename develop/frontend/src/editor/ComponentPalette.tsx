import { useDraggable } from '@dnd-kit/core'
import { COMPONENT_DEFS, CATEGORY_ORDER, CATEGORY_LABELS } from './componentDefs'
import type { ComponentDef } from './types'

interface PaletteItemProps {
  type: string
  def: ComponentDef
}

function PaletteItem({ type, def }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette::${type}`,
    data: { from: 'palette', componentType: type },
  })

  return (
    <button
      ref={setNodeRef}
      className={`palette-item${isDragging ? ' palette-item--dragging' : ''}`}
      {...listeners}
      {...attributes}
      tabIndex={0}
    >
      <svg className="palette-item__icon" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={def.icon} />
      </svg>
      {def.label}
    </button>
  )
}

export function ComponentPalette() {
  const byCategory = CATEGORY_ORDER.map(cat => ({
    cat,
    items: Object.entries(COMPONENT_DEFS).filter(([, d]) => d.category === cat),
  })).filter(g => g.items.length > 0)

  return (
    <aside className="editor-palette">
      {byCategory.map(({ cat, items }) => (
        <div key={cat}>
          <p className="palette-section-label">{CATEGORY_LABELS[cat]}</p>
          {items.map(([type, def]) => (
            <PaletteItem key={type} type={type} def={def} />
          ))}
        </div>
      ))}
    </aside>
  )
}
