import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends PergolaStyle {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  size?: InputSize
  type?: string
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
}

export function Input({
  value, onChange, placeholder, label, hint, error, size = 'md',
  type = 'text', disabled, readOnly, autoFocus, onKeyDown, className, ...styling
}: InputProps) {
  return (
    <div className={['pgl-field', className ?? ''].filter(Boolean).join(' ')}>
      {label && <label className="pgl-field__label">{label}</label>}
      <input
        className={['pgl-input', `pgl-input--${size}`, error ? 'pgl-input--error' : ''].filter(Boolean).join(' ')}
        style={toStyle(styling as PergolaStyle)}
        type={type} value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        readOnly={readOnly} autoFocus={autoFocus}
        onKeyDown={onKeyDown}
      />
      {hint  && <span className="pgl-field__hint">{hint}</span>}
      {error && <span className="pgl-field__error">{error}</span>}
    </div>
  )
}
