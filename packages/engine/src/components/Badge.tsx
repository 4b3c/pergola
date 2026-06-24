import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type BadgeVariant = 'default' | 'accent' | 'danger' | 'success'

export interface BadgeProps extends PergolaStyle {
  children?: React.ReactNode
  variant?: BadgeVariant
  icon?: React.ReactNode
  className?: string
}

export function Badge({ children, variant = 'default', icon, className, ...styling }: BadgeProps) {
  return (
    <span
      className={['pgl-badge', `pgl-badge--${variant}`, className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      {icon}
      {children}
    </span>
  )
}
