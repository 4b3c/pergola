import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface ToggleProps extends PergolaStyle {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Toggle({ checked = false, onChange, label, disabled, className, ...styling }: ToggleProps) {
  return (
    <label
      className={[
        'pgl-toggle',
        checked ? 'pgl-toggle--on' : '',
        disabled ? 'pgl-toggle--disabled' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ opacity: disabled ? 0.4 : undefined, cursor: disabled ? 'not-allowed' : 'pointer', ...toStyle(styling as PergolaStyle) }}
    >
      <span className="pgl-toggle__track" onClick={() => !disabled && onChange?.(!checked)}>
        <span className="pgl-toggle__thumb" />
      </span>
      {label && <span className="pgl-toggle__label">{label}</span>}
    </label>
  )
}
