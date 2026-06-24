import type React from 'react'
import type { PergolaStyle } from './types'

const SHADOWS: Record<string, string> = {
  none: 'none',
  xs:   '0 1px 2px rgba(0,0,0,0.3)',
  sm:   '0 2px 8px rgba(0,0,0,0.35)',
  md:   '0 4px 16px rgba(0,0,0,0.4)',
  lg:   '0 8px 32px rgba(0,0,0,0.5)',
  xl:   '0 24px 64px rgba(0,0,0,0.65)',
}

function px(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v
}

export function toStyle(s: PergolaStyle): React.CSSProperties {
  const css: React.CSSProperties = {}

  if (s.bg          != null) css.backgroundColor = s.bg
  if (s.textColor   != null) css.color           = s.textColor
  if (s.font        != null) css.fontFamily       = s.font
  if (s.fontSize    != null) css.fontSize         = s.fontSize
  if (s.fontWeight  != null) css.fontWeight       = s.fontWeight
  if (s.letterSpacing != null) css.letterSpacing  = `${s.letterSpacing}em`
  if (s.lineHeight  != null) css.lineHeight       = s.lineHeight
  if (s.italic)              css.fontStyle        = 'italic'
  if (s.underline)           css.textDecoration   = 'underline'

  if (s.width     != null) css.width     = px(s.width)
  if (s.height    != null) css.height    = px(s.height)
  if (s.minWidth  != null) css.minWidth  = px(s.minWidth)
  if (s.maxWidth  != null) css.maxWidth  = px(s.maxWidth)
  if (s.minHeight != null) css.minHeight = px(s.minHeight)
  if (s.maxHeight != null) css.maxHeight = px(s.maxHeight)

  if (s.padding   != null) css.padding  = px(s.padding)
  if (s.paddingX  != null) { css.paddingLeft  = s.paddingX;  css.paddingRight  = s.paddingX }
  if (s.paddingY  != null) { css.paddingTop   = s.paddingY;  css.paddingBottom = s.paddingY }
  if (s.paddingTop    != null) css.paddingTop    = s.paddingTop
  if (s.paddingRight  != null) css.paddingRight  = s.paddingRight
  if (s.paddingBottom != null) css.paddingBottom = s.paddingBottom
  if (s.paddingLeft   != null) css.paddingLeft   = s.paddingLeft
  if (s.margin  != null) css.margin  = px(s.margin)
  if (s.marginX != null) { css.marginLeft  = s.marginX; css.marginRight  = s.marginX }
  if (s.marginY != null) { css.marginTop   = s.marginY; css.marginBottom = s.marginY }
  if (s.gap     != null) css.gap = s.gap

  if (s.border === true) {
    css.border = `${s.borderWidth ?? 1}px ${s.borderStyle ?? 'solid'} ${s.borderColor ?? 'var(--border)'}`
  } else if (s.border === false) {
    css.border = 'none'
  } else {
    if (s.borderColor != null) css.borderColor = s.borderColor
    if (s.borderWidth != null) css.borderWidth = s.borderWidth
    if (s.borderStyle != null) css.borderStyle = s.borderStyle
  }
  if (s.borderRadius != null) css.borderRadius = s.borderRadius

  if (s.shadow  != null) css.boxShadow = SHADOWS[s.shadow] ?? s.shadow
  if (s.opacity != null) css.opacity   = s.opacity
  if (s.overflow != null) css.overflow = s.overflow

  return css
}
