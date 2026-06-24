import { useContext } from 'react'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditorContext } from './LayoutEditor'
import { CONTAINER_TYPES, COMPONENT_DEFS } from './componentDefs'
import type { EditorNode as EditorNodeType } from './types'

// Component registry — maps type names to engine components
import {
  Text, Button, Badge, Tag, Avatar, Spinner, Divider,
  Card, Stack, Grid, Input, Textarea, Select, Toggle, Checkbox, Slider,
  EmptyState,
} from '@pergola/engine'

const REGISTRY: Record<string, React.ComponentType<any>> = {
  Text, Button, Badge, Tag, Avatar, Spinner, Divider,
  Card, Stack, Grid, Input, Textarea, Select, Toggle, Checkbox, Slider,
  EmptyState,
}

// ── Empty drop zone for containers with no children ───────────────────────────
function EmptyDropZone({ parentId }: { parentId: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone::${parentId}`,
    data: { type: 'dropzone', parentId },
  })
  return (
    <div ref={setNodeRef} className={`editor-drop-zone${isOver ? ' editor-drop-zone--over' : ''}`}>
      drop here
    </div>
  )
}

// ── Single node ───────────────────────────────────────────────────────────────
export function EditorNode({ node, depth = 0 }: { node: EditorNodeType; depth?: number }) {
  const ctx = useContext(EditorContext)!
  const { state, dispatch } = ctx
  const isSelected = state.selectedId === node.id
  const isContainer = CONTAINER_TYPES.has(node.type)

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({
    id: node.id,
    data: { from: 'canvas', nodeId: node.id, parentId: null },
  })

  const Component = REGISTRY[node.type]
  if (!Component) {
    return (
      <div style={{ padding: 8, border: '1px dashed var(--danger)', borderRadius: 6, fontSize: 12, color: 'var(--danger)' }}>
        Unknown: {node.type}
      </div>
    )
  }

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(depth === 0 ? {} : {}),
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({ type: 'SELECT', id: node.id })
  }

  const childIds = (node.children ?? []).map(c => c.id)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'editor-node-wrap',
        isSelected ? 'editor-node-wrap--selected' : '',
        isDragging ? 'editor-node-wrap--dragging' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {isSelected && <div className="editor-node-label">{node.type}</div>}

      {isContainer ? (
        <Component {...node.props}>
          <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
            {childIds.length === 0
              ? <EmptyDropZone parentId={node.id} />
              : (node.children ?? []).map(child => (
                  <EditorNode key={child.id} node={child} depth={depth + 1} />
                ))
            }
          </SortableContext>
        </Component>
      ) : (
        <Component {...node.props}>{node.content}</Component>
      )}
    </div>
  )
}
