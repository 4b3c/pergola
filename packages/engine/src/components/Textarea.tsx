import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface TextareaProps extends PergolaStyle {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  rows?: number
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function Textarea({
  value, onChange, placeholder, label, hint, error,
  rows = 4, disabled, autoFocus, className, ...styling
}: TextareaProps) {
  return (
    <div className={['pgl-field', className ?? ''].filter(Boolean).join(' ')}>
      {label && <label className="pgl-field__label">{label}</label>}
      <textarea
        className={['pgl-textarea', error ? 'pgl-textarea--error' : ''].filter(Boolean).join(' ')}
        style={toStyle(styling as PergolaStyle)}
        value={value ?? ''} onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder} rows={rows} disabled={disabled} autoFocus={autoFocus}
      />
      {hint  && <span className="pgl-field__hint">{hint}</span>}
      {error && <span className="pgl-field__error">{error}</span>}
    </div>
  )
}
