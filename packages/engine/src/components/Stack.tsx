import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface StackProps extends PergolaStyle {
  children?: React.ReactNode
  direction?: 'row' | 'col'
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  wrap?: boolean
  className?: string
}

export function Stack({ children, direction = 'col', align, justify, wrap, className, ...styling }: StackProps) {
  return (
    <div
      className={[
        'pgl-stack',
        `pgl-stack--${direction}`,
        wrap ? 'pgl-stack--wrap' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...toStyle(styling as PergolaStyle) }}
    >
      {children}
    </div>
  )
}
