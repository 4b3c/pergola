import type React from 'react'

// ── Shared styling interface ─────────────────────────────────────────────────
// Every pergola component extends this. Props are converted to inline styles
// by toStyle(), letting any value override the component's CSS defaults.

export interface PergolaStyle {
  // Background
  bg?: string

  // Color tokens (consumed by components, not mapped to CSS directly)
  color?: string
  secondaryColor?: string
  textColor?: string

  // Typography
  font?: string
  fontSize?: number
  fontWeight?: 300 | 400 | 500 | 600 | 700 | 800 | 900
  letterSpacing?: number   // em units
  lineHeight?: number      // unitless
  italic?: boolean
  underline?: boolean

  // Dimensions
  width?: number | string
  height?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  minHeight?: number | string
  maxHeight?: number | string

  // Spacing
  padding?: number | string
  paddingX?: number
  paddingY?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  margin?: number | string
  marginX?: number
  marginY?: number
  gap?: number

  // Border
  border?: boolean
  borderColor?: string
  borderWidth?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderRadius?: number

  // Effects
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
  overflow?: 'hidden' | 'auto' | 'scroll' | 'visible'
}

// ── Layout JSON node ─────────────────────────────────────────────────────────
// This is what lives in app/layouts/*.json

export interface LayoutNode {
  type: string
  props?: Record<string, unknown>
  children?: LayoutNode[]
  content?: string
  key?: string
}

// ── Component registry type ──────────────────────────────────────────────────
export type ComponentMap = Record<string, React.ComponentType<any>>
