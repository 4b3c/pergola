import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends PergolaStyle {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: React.CSSProperties
}

export function Button({
  children, variant = 'primary', size = 'md', icon, iconRight,
  disabled, loading, onClick, type = 'button', className, style: styleProp, ...styling
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'pgl-button',
        `pgl-button--${variant}`,
        `pgl-button--${size}`,
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ ...toStyle(styling as PergolaStyle), ...styleProp }}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading
        ? <span className="pgl-spinner pgl-spinner--xs" />
        : icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      }
      {children}
      {iconRight && <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>}
    </button>
  )
}
