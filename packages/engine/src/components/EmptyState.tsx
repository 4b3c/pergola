import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface EmptyStateProps extends PergolaStyle {
  icon?: React.ReactNode
  title?: string
  body?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className, ...styling }: EmptyStateProps) {
  return (
    <div
      className={['pgl-empty', className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      {icon  && <div className="pgl-empty__icon">{icon}</div>}
      {title && <p className="pgl-empty__title">{title}</p>}
      {body  && <p className="pgl-empty__body">{body}</p>}
      {action}
    </div>
  )
}
