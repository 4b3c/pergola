import React from 'react'
import type { LayoutNode, ComponentMap } from '../types'
import { defaultRegistry } from './registry'

interface RenderOptions {
  registry?: ComponentMap
}

export function renderLayout(node: LayoutNode, opts: RenderOptions = {}): React.ReactElement {
  const registry = { ...defaultRegistry, ...(opts.registry ?? {}) }
  return renderNode(node, registry, 0)
}

function renderNode(node: LayoutNode, registry: ComponentMap, index: number): React.ReactElement {
  const Component = registry[node.type]

  if (!Component) {
    return (
      <div key={node.key ?? index} style={{ border: '1px dashed var(--danger)', padding: 8, borderRadius: 4, fontSize: 12, color: 'var(--danger)' }}>
        Unknown component: <code>{node.type}</code>
      </div>
    )
  }

  const children = node.children?.map((child, i) => renderNode(child, registry, i))

  return (
    <Component key={node.key ?? index} {...(node.props ?? {})}>
      {node.content ?? children}
    </Component>
  )
}

export { defaultRegistry }
export type { RenderOptions }
