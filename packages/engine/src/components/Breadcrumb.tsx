import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

export interface BreadcrumbProps extends PergolaStyle {
  items: BreadcrumbItem[]
  separator?: string
  className?: string
}

export function Breadcrumb({ items, separator = '/', className, ...styling }: BreadcrumbProps) {
  return (
    <nav className={['pgl-breadcrumb', className ?? ''].filter(Boolean).join(' ')} style={toStyle(styling as PergolaStyle)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <button
            type="button"
            className={[
              'pgl-breadcrumb__item',
              i === items.length - 1 ? 'pgl-breadcrumb__item--current' : '',
            ].filter(Boolean).join(' ')}
            onClick={item.onClick}
          >
            {item.label}
          </button>
          {i < items.length - 1 && (
            <span className="pgl-breadcrumb__sep">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
