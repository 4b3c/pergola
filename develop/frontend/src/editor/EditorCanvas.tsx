import { useContext } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCenter, type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { EditorContext } from './LayoutEditor'
import { EditorNode } from './EditorNode'
import { COMPONENT_DEFS, CONTAINER_TYPES } from './componentDefs'
import { findNode, findParent, makeId } from './useEditor'
import type { EditorNode as EditorNodeType } from './types'

// ── Drag overlay ghost ────────────────────────────────────────────────────────
function DragGhost({ type }: { type: string }) {
  const def = COMPONENT_DEFS[type]
  return (
    <div className="editor-drag-overlay">
      {def && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={def.icon} />
        </svg>
      )}
      {def?.label ?? type}
    </div>
  )
}

// ── Canvas ────────────────────────────────────────────────────────────────────
export function EditorCanvas() {
  const { state, dispatch, dragType, setDragType } = useContext(EditorContext)!
  const { layout, selectedId } = state
  const root = layout.root

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current
    if (data?.from === 'palette') setDragType(data.componentType)
    else if (data?.from === 'canvas') setDragType(data.nodeId)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDragType(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData   = over.data.current

    // ── Drop from palette ─────────────────────────────────────────────────────
    if (activeData?.from === 'palette') {
      const componentType = activeData.componentType as string
      const def = COMPONENT_DEFS[componentType]
      if (!def) return

      const newNode: EditorNodeType = {
        id: makeId(),
        type: componentType,
        props: { ...def.defaultProps },
        content: def.defaultContent,
        ...(def.acceptsChildren ? { children: [] } : {}),
      }

      // Dropped on a drop-zone (empty container)
      if (over.id.toString().startsWith('dropzone::')) {
        const parentId = over.id.toString().replace('dropzone::', '')
        dispatch({ type: 'ADD_NODE', parentId, node: newNode })
        return
      }

      // Dropped on an existing node — insert as sibling in the same parent,
      // or as a child if the target is a container with no children
      const overNodeId = over.id as string
      const overNode = findNode(root, overNodeId)
      if (overNode && CONTAINER_TYPES.has(overNode.type) && !(overNode.children?.length)) {
        dispatch({ type: 'ADD_NODE', parentId: overNodeId, node: newNode })
      } else {
        const parent = findParent(root, overNodeId) ?? root
        const siblings = parent.children ?? []
        const overIdx = siblings.findIndex(c => c.id === overNodeId)
        dispatch({ type: 'ADD_NODE', parentId: parent.id, node: newNode, index: overIdx + 1 })
      }
      return
    }

    // ── Reorder within canvas ─────────────────────────────────────────────────
    if (activeData?.from === 'canvas') {
      const nodeId   = active.id as string
      const overId   = over.id as string

      if (nodeId === overId) return

      // Handle drop on a dropzone
      if (overId.startsWith('dropzone::')) {
        const parentId = overId.replace('dropzone::', '')
        dispatch({ type: 'MOVE_NODE', nodeId, newParentId: parentId, newIndex: 0 })
        return
      }

      // Find shared parent and reorder
      const activeParent = findParent(root, nodeId)
      const overParent   = findParent(root, overId)

      if (activeParent && overParent && activeParent.id === overParent.id) {
        // Same parent — reorder with arrayMove
        const siblings  = activeParent.children ?? []
        const fromIdx   = siblings.findIndex(c => c.id === nodeId)
        const toIdx     = siblings.findIndex(c => c.id === overId)
        if (fromIdx === -1 || toIdx === -1) return
        const reordered = arrayMove(siblings, fromIdx, toIdx)
        // Apply by deleting + re-inserting at correct position
        const movedNode = siblings[fromIdx]
        dispatch({ type: 'MOVE_NODE', nodeId, newParentId: activeParent.id, newIndex: toIdx })
        void reordered // suppress unused warning
        void movedNode
      } else if (overParent) {
        // Different parent — move to new parent
        const toIdx = (overParent.children ?? []).findIndex(c => c.id === overId)
        dispatch({ type: 'MOVE_NODE', nodeId, newParentId: overParent.id, newIndex: toIdx })
      }
    }
  }

  const rootChildIds = (root.children ?? []).map(c => c.id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="editor-canvas-wrap"
        onClick={() => dispatch({ type: 'SELECT', id: null })}
      >
        <div className="editor-canvas">
          <SortableContext items={rootChildIds} strategy={verticalListSortingStrategy}>
            <EditorNode node={root} depth={0} />
          </SortableContext>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {dragType && <DragGhost type={dragType} />}
      </DragOverlay>
    </DndContext>
  )
}
