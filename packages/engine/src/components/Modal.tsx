import React, { useEffect } from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface ModalProps extends PergolaStyle {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  width?: number | string
  className?: string
}

export function Modal({ open, onClose, title, children, footer, width, className, ...styling }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <div
      className={['pgl-modal-overlay', open ? 'pgl-modal-overlay--open' : ''].filter(Boolean).join(' ')}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={['pgl-modal', className ?? ''].filter(Boolean).join(' ')}
        style={{ width: width ?? undefined, ...toStyle(styling as PergolaStyle) }}
      >
        {title != null && (
          <div className="pgl-modal__header">
            <span className="pgl-modal__title">{title}</span>
            <button className="pgl-modal__close" onClick={onClose} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children && <div className="pgl-modal__body">{children}</div>}
        {footer   && <div className="pgl-modal__footer">{footer}</div>}
      </div>
    </div>
  )
}
