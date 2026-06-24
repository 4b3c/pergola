import React from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  render?: (value: unknown, row: T) => React.ReactNode
  width?: number | string
}

export interface TableProps<T = Record<string, unknown>> extends PergolaStyle {
  columns: TableColumn<T>[]
  rows: T[]
  keyField?: string
  striped?: boolean
  empty?: React.ReactNode
  className?: string
}

export function Table<T extends Record<string, unknown>>({
  columns, rows, keyField = 'id', striped, empty, className, ...styling
}: TableProps<T>) {
  return (
    <div
      className={['pgl-table-wrap', className ?? ''].filter(Boolean).join(' ')}
      style={toStyle(styling as PergolaStyle)}
    >
      <table className={['pgl-table', striped ? 'pgl-table--striped' : ''].filter(Boolean).join(' ')}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>{empty ?? 'No data'}</td></tr>
            : rows.map((row, i) => (
                <tr key={String(row[keyField] ?? i)}>
                  {columns.map(col => (
                    <td key={col.key}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</td>
                  ))}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  )
}
