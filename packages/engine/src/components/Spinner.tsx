import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps extends PergolaStyle {
  size?: SpinnerSize
  className?: string
}

export function Spinner({ size = 'md', className, ...styling }: SpinnerProps) {
  return (
    <span
      className={['pgl-spinner', `pgl-spinner--${size}`, className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    />
  )
}
