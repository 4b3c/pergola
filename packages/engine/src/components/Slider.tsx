import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface SliderProps extends PergolaStyle {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
  className?: string
}

export function Slider({
  value = 0, onChange, min = 0, max = 100, step = 1,
  label, showValue = true, disabled, className, ...styling
}: SliderProps) {
  return (
    <div className={['pgl-slider', className ?? ''].filter(Boolean).join(' ')} style={toStyle(styling as PergolaStyle)}>
      {(label || showValue) && (
        <div className="pgl-slider__label-row">
          {label    && <span className="pgl-slider__label">{label}</span>}
          {showValue && <span className="pgl-slider__value">{value}</span>}
        </div>
      )}
      <input
        className="pgl-slider__input"
        type="range" min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={e => onChange?.(Number(e.target.value))}
      />
    </div>
  )
}
