import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface GridProps extends PergolaStyle {
  children?: React.ReactNode
  columns?: number | string
  rows?: number | string
  className?: string
}

export function Grid({ children, columns, rows, className, ...styling }: GridProps) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    gridTemplateRows:    typeof rows    === 'number' ? `repeat(${rows}, 1fr)`    : rows,
    ...toStyle(styling as PergolaStyle),
  }
  return (
    <div className={['pgl-grid', className ?? ''].filter(Boolean).join(' ')} style={gridStyle}>
      {children}
    </div>
  )
}
