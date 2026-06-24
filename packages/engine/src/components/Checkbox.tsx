import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface CheckboxProps extends PergolaStyle {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({ checked = false, onChange, label, disabled, className, ...styling }: CheckboxProps) {
  return (
    <label
      className={[
        'pgl-checkbox',
        checked ? 'pgl-checkbox--checked' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ opacity: disabled ? 0.4 : undefined, cursor: disabled ? 'not-allowed' : 'pointer', ...toStyle(styling as PergolaStyle) }}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <span className="pgl-checkbox__box">
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0e0d0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {label && <span className="pgl-checkbox__label">{label}</span>}
    </label>
  )
}
