import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface TopBarProps extends PergolaStyle {
  logo?: React.ReactNode
  logoHref?: string
  title?: string
  path?: string
  children?: React.ReactNode
  className?: string
}

export function TopBar({ logo, logoHref = '/', title, path, children, className, ...styling }: TopBarProps) {
  return (
    <header
      className={['pgl-topbar', className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      <a href={logoHref} className="pgl-topbar__logo">{logo ?? 'pergola'}</a>
      {(title || path) && <span className="pgl-topbar__sep" />}
      {title && <span className="pgl-topbar__title">{title}</span>}
      {path  && <span className="pgl-topbar__path" title={path}>{path}</span>}
      <span className="pgl-topbar__spacer" />
      {children}
    </header>
  )
}
