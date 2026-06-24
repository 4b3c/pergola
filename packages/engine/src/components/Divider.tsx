import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface DividerProps extends PergolaStyle {
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({ direction = 'horizontal', className, ...styling }: DividerProps) {
  return (
    <div
      className={['pgl-divider', `pgl-divider--${direction}`, className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    />
  )
}
