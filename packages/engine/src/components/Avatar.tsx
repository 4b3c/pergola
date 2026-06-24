import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends PergolaStyle {
  name?: string
  src?: string
  size?: AvatarSize
  className?: string
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function Avatar({ name, src, size = 'md', className, ...styling }: AvatarProps) {
  return (
    <span
      className={['pgl-avatar', `pgl-avatar--${size}`, className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
      title={name}
    >
      {src ? <img src={src} alt={name} /> : name ? initials(name) : '?'}
    </span>
  )
}
