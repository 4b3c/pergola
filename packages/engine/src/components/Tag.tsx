import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface TagProps extends PergolaStyle {
  children?: React.ReactNode
  onRemove?: () => void
  className?: string
}

export function Tag({ children, onRemove, className, ...styling }: TagProps) {
  return (
    <span
      className={['pgl-tag', className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      {children}
      {onRemove && (
        <button className="pgl-tag__remove" onClick={onRemove} type="button" aria-label="Remove">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
