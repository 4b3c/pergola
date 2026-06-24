import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface CardProps extends PergolaStyle {
  children?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
  onClick?: () => void
  className?: string
}

export function Card({ children, header, footer, hoverable, onClick, className, ...styling }: CardProps) {
  return (
    <div
      className={[
        'pgl-card',
        hoverable || onClick ? 'pgl-card--hoverable' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
      onClick={onClick}
    >
      {header && <div className="pgl-card__header">{header}</div>}
      {children && <div className="pgl-card__body">{children}</div>}
      {footer && <div className="pgl-card__footer">{footer}</div>}
    </div>
  )
}
