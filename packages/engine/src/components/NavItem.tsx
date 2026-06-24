import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface NavItemProps extends PergolaStyle {
  children?: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

export function NavItem({ children, icon, active, onClick, className, ...styling }: NavItemProps) {
  return (
    <button
      type="button"
      className={[
        'pgl-nav-item',
        active ? 'pgl-nav-item--active' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
      onClick={onClick}
    >
      {icon && <span className="pgl-nav-item__icon">{icon}</span>}
      {children}
    </button>
  )
}
