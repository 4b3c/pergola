import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface SidebarProps extends PergolaStyle {
  logo?: string
  logoHref?: string
  appName?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({ logo = 'pergola', logoHref = '/', appName, children, footer, className, ...styling }: SidebarProps) {
  return (
    <aside
      className={['pgl-sidebar', className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      <div className="pgl-sidebar__brand">
        <a href={logoHref} className="pgl-sidebar__logo">{logo}</a>
        {appName && <span className="pgl-sidebar__name">{appName}</span>}
      </div>
      <nav className="pgl-sidebar__nav">{children}</nav>
      {footer && <div className="pgl-sidebar__footer">{footer}</div>}
    </aside>
  )
}
