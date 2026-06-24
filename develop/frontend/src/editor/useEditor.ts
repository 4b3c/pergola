import { useReducer } from 'react'
import type { EditorState, EditorAction, EditorNode, EditorLayout } from './types'

// ── Tree helpers ──────────────────────────────────────────────────────────────

export function findNode(root: EditorNode, id: string): EditorNode | null {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

export function findParent(root: EditorNode, id: string): EditorNode | null {
  for (const child of root.children ?? []) {
    if (child.id === id) return root
    const found = findParent(child, id)
    if (found) return found
  }
  return null
}

function mapNode(root: EditorNode, id: string, fn: (n: EditorNode) => EditorNode): EditorNode {
  if (root.id === id) return fn(root)
  if (!root.children) return root
  return { ...root, children: root.children.map(c => mapNode(c, id, fn)) }
}

function removeFromTree(root: EditorNode, id: string): EditorNode {
  return {
    ...root,
    children: (root.children ?? [])
      .filter(c => c.id !== id)
      .map(c => removeFromTree(c, id)),
  }
}

function insertIntoParent(root: EditorNode, parentId: string, node: EditorNode, index?: number): EditorNode {
  return mapNode(root, parentId, parent => {
    const children = [...(parent.children ?? [])]
    const idx = index != null && index >= 0 ? Math.min(index, children.length) : children.length
    children.splice(idx, 0, node)
    return { ...parent, children }
  })
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {

    case 'LOAD':
      return { layout: action.layout, selectedId: null, dirty: false }

    case 'MARK_SAVED':
      return { ...state, dirty: false }

    case 'SELECT':
      return { ...state, selectedId: action.id }

    case 'ADD_NODE': {
      const root = insertIntoParent(state.layout.root, action.parentId, action.node, action.index)
      return { ...state, layout: { ...state.layout, root }, selectedId: action.node.id, dirty: true }
    }

    case 'MOVE_NODE': {
      if (action.nodeId === action.newParentId) return state
      const node = findNode(state.layout.root, action.nodeId)
      if (!node) return state
      let root = removeFromTree(state.layout.root, action.nodeId)
      root = insertIntoParent(root, action.newParentId, node, action.newIndex)
      return { ...state, layout: { ...state.layout, root }, dirty: true }
    }

    case 'DELETE_NODE': {
      if (action.id === 'root') return state
      const root = removeFromTree(state.layout.root, action.id)
      return { ...state, layout: { ...state.layout, root }, selectedId: null, dirty: true }
    }

    case 'UPDATE_PROPS': {
      const root = mapNode(state.layout.root, action.id, n => ({
        ...n,
        props: { ...n.props, ...action.props },
      }))
      return { ...state, layout: { ...state.layout, root }, dirty: true }
    }

    case 'UPDATE_CONTENT': {
      const root = mapNode(state.layout.root, action.id, n => ({ ...n, content: action.content }))
      return { ...state, layout: { ...state.layout, root }, dirty: true }
    }

    default:
      return state
  }
}

const EMPTY_LAYOUT: EditorLayout = {
  name: '', version: '0.1.0',
  root: { id: 'root', type: 'Stack', props: { direction: 'col', gap: 16, padding: 24, minHeight: '100vh' }, children: [] },
}

export function useEditor() {
  const [state, dispatch] = useReducer(reducer, { layout: EMPTY_LAYOUT, selectedId: null, dirty: false })
  return { state, dispatch }
}

// ── ID generation ─────────────────────────────────────────────────────────────

export function makeId(): string {
  return Math.random().toString(36).slice(2, 8)
}
