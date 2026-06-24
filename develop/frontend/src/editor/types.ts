export interface EditorNode {
  id: string
  type: string
  props: Record<string, unknown>
  children?: EditorNode[]
  content?: string
}

export interface EditorLayout {
  name: string
  version: string
  root: EditorNode
}

export type PropType = 'text' | 'number' | 'color' | 'boolean' | 'select' | 'textarea'

export interface PropDef {
  key: string
  label: string
  type: PropType
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  group?: 'content' | 'layout' | 'typography' | 'background' | 'border' | 'effects'
  isContent?: boolean  // maps to node.content instead of node.props
}

export interface ComponentDef {
  label: string
  category: 'layout' | 'content' | 'form' | 'display'
  icon: string          // SVG path data
  acceptsChildren: boolean
  defaultProps: Record<string, unknown>
  defaultContent?: string
  propDefs: PropDef[]
}

export interface EditorState {
  layout: EditorLayout
  selectedId: string | null
  dirty: boolean
}

export type EditorAction =
  | { type: 'SELECT'; id: string | null }
  | { type: 'ADD_NODE'; parentId: string; node: EditorNode; index?: number }
  | { type: 'MOVE_NODE'; nodeId: string; newParentId: string; newIndex: number }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'UPDATE_PROPS'; id: string; props: Record<string, unknown> }
  | { type: 'UPDATE_CONTENT'; id: string; content: string }
  | { type: 'LOAD'; layout: EditorLayout }
  | { type: 'MARK_SAVED' }
