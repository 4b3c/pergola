import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface SelectOption { value: string; label: string }

export interface SelectProps extends PergolaStyle {
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function Select({
  value, onChange, options, placeholder, label, hint, error, disabled, className, ...styling
}: SelectProps) {
  return (
    <div className={['pgl-field', className ?? ''].filter(Boolean).join(' ')}>
      {label && <label className="pgl-field__label">{label}</label>}
      <select
        className={['pgl-select', error ? 'pgl-select--error' : ''].filter(Boolean).join(' ')}
        style={toStyle(styling as PergolaStyle)}
        value={value ?? ''} onChange={e => onChange?.(e.target.value)} disabled={disabled}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint  && <span className="pgl-field__hint">{hint}</span>}
      {error && <span className="pgl-field__error">{error}</span>}
    </div>
  )
}
