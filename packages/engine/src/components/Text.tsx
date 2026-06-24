import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type TextVariant = 'display' | 'heading' | 'subheading' | 'body' | 'label' | 'caption' | 'code'

export interface TextProps extends PergolaStyle {
  children?: React.ReactNode
  variant?: TextVariant
  align?: 'left' | 'center' | 'right' | 'justify'
  as?: keyof React.JSX.IntrinsicElements
  truncate?: boolean
  className?: string
}

export function Text({
  children, variant = 'body', align, truncate, className,
  as: Tag = 'span', ...styling
}: TextProps) {
  return (
    <Tag
      className={[
        'pgl-text',
        `pgl-text--${variant}`,
        truncate ? 'pgl-text--truncate' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ textAlign: align, ...toStyle(styling as PergolaStyle) }}
    >
      {children}
    </Tag>
  )
}
