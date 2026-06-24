import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, EmptyState, Spinner } from '@pergola/engine'
import { api } from '../../lib/api'
import type { DbEntry, DbSchema, FieldSchema } from '../../lib/api'

const FIELD_TYPES = ['text', 'integer', 'float', 'boolean', 'timestamp', 'json']

const DB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
)

export default function Databases() {
  const [view,   setView]   = useState<'list' | 'detail'>('list')
  const [dbs,    setDbs]    = useState<DbEntry[]>([])
  const [db,     setDb]     = useState<DbSchema | null>(null)
  const [loading, setLoading] = useState(true)

  const [showDbForm, setShowDbForm]       = useState(false)
  const [newDbName,  setNewDbName]        = useState('')
  const [dbFormErr,  setDbFormErr]        = useState('')

  const [showTableForm, setShowTableForm] = useState(false)
  const [newTableName,  setNewTableName]  = useState('')
  const [tableFormErr,  setTableFormErr]  = useState('')

  const [addFieldTable, setAddFieldTable] = useState<string | null>(null)
  const [newFieldName,  setNewFieldName]  = useState('')
  const [newFieldType,  setNewFieldType]  = useState('text')
  const [fieldFormErr,  setFieldFormErr]  = useState('')

  const newDbRef    = useRef<HTMLInputElement>(null)
  const newTableRef = useRef<HTMLInputElement>(null)
  const newFieldRef = useRef<HTMLInputElement>(null)

  const loadDbs = useCallback(() => {
    setLoading(true)
    api.databases().then(setDbs).finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadDbs() }, [loadDbs])

  async function openDb(name: string) {
    const schema = await api.getDb(name)
    setDb(schema); setView('detail'); setShowTableForm(false)
  }

  function backToList() { setView('list'); setDb(null); loadDbs() }

  async function submitCreateDb() {
    if (!newDbName.trim()) return
    try {
      await api.createDb(newDbName.trim())
      setShowDbForm(false); setNewDbName(''); setDbFormErr('')
      loadDbs()
    } catch (e: unknown) { setDbFormErr(e instanceof Error ? e.message : 'Error') }
  }

  async function submitCreateTable() {
    if (!newTableName.trim() || !db) return
    try {
      await api.createTable(db.name, newTableName.trim())
      const updated = await api.getDb(db.name)
      setDb(updated); setShowTableForm(false); setNewTableName(''); setTableFormErr('')
    } catch (e: unknown) { setTableFormErr(e instanceof Error ? e.message : 'Error') }
  }

  async function submitAddField(tableName: string) {
    if (!newFieldName.trim() || !db) return
    try {
      await api.addField(db.name, tableName, newFieldName.trim(), newFieldType)
      const updated = await api.getDb(db.name)
      setDb(updated); setAddFieldTable(null); setNewFieldName(''); setNewFieldType('text'); setFieldFormErr('')
    } catch (e: unknown) { setFieldFormErr(e instanceof Error ? e.message : 'Error') }
  }

  async function deleteField(tableName: string, fieldName: string) {
    if (!db) return
    await api.deleteField(db.name, tableName, fieldName)
    const updated = await api.getDb(db.name)
    setDb(updated)
  }

  useEffect(() => { if (showDbForm)    newDbRef.current?.focus() },    [showDbForm])
  useEffect(() => { if (showTableForm) newTableRef.current?.focus() }, [showTableForm])
  useEffect(() => { if (addFieldTable) newFieldRef.current?.focus() }, [addFieldTable])

  if (view === 'list') return (
    <div>
      <div className="pgl-section-header">
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Databases</h2>
        <Button variant="ghost" size="sm" onClick={() => { setShowDbForm(true) }}
          icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>}>
          Create database
        </Button>
      </div>

      {showDbForm && (
        <div className="pgl-inline-form pgl-inline-form--visible">
          <input ref={newDbRef} className="pgl-inline-input" placeholder="database name"
            value={newDbName} onChange={e => setNewDbName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitCreateDb(); if (e.key === 'Escape') { setShowDbForm(false); setNewDbName(''); setDbFormErr('') } }} />
          <Button variant="primary" size="xs" onClick={submitCreateDb}>Create</Button>
          <Button variant="ghost"   size="xs" onClick={() => { setShowDbForm(false); setNewDbName(''); setDbFormErr('') }}>Cancel</Button>
          {dbFormErr && <span className="pgl-inline-error">{dbFormErr}</span>}
        </div>
      )}

      {loading
        ? <EmptyState icon={<Spinner />} />
        : dbs.length === 0
          ? <EmptyState icon={DB_ICON} title="No databases yet" body="Create a database to start defining your data schema." />
          : dbs.map(d => (
              <div key={d.name} className="pgl-db-item" onDoubleClick={() => openDb(d.name)} title="Double-click to open">
                <span className="pgl-db-item__icon">{DB_ICON}</span>
                <div className="pgl-db-item__info">
                  <span className="pgl-db-item__name">{d.name}</span>
                  <span className="pgl-db-item__meta">{d.table_count} {d.table_count === 1 ? 'table' : 'tables'}</span>
                </div>
                {d.status !== 'ok' && (
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid rgba(192,112,90,0.25)' }}>
                    {d.status}
                  </span>
                )}
              </div>
            ))
      }
    </div>
  )

  // Detail view
  const tables = db?.tables ?? {}
  return (
    <div>
      <div className="pgl-section-header">
        <div className="pgl-section-header__left">
          <button className="pgl-back-btn" onClick={backToList}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Databases
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>{db?.name}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowTableForm(true)}
          icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>}>
          Create table
        </Button>
      </div>

      {showTableForm && (
        <div className="pgl-inline-form pgl-inline-form--visible">
          <input ref={newTableRef} className="pgl-inline-input" placeholder="table name"
            value={newTableName} onChange={e => setNewTableName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitCreateTable(); if (e.key === 'Escape') { setShowTableForm(false); setNewTableName('') } }} />
          <Button variant="primary" size="xs" onClick={submitCreateTable}>Create</Button>
          <Button variant="ghost"   size="xs" onClick={() => { setShowTableForm(false); setNewTableName('') }}>Cancel</Button>
          {tableFormErr && <span className="pgl-inline-error">{tableFormErr}</span>}
        </div>
      )}

      {Object.keys(tables).length === 0
        ? <EmptyState title="No tables yet" body="Create a table to start defining your schema." />
        : Object.entries(tables).map(([tableName, table]) => (
            <div key={tableName} className="pgl-table-card">
              <div className="pgl-table-card__header">
                <span className="pgl-table-card__name">{tableName}</span>
                <Button variant="ghost" size="xs"
                  onClick={() => { setAddFieldTable(addFieldTable === tableName ? null : tableName); setNewFieldName(''); setFieldFormErr('') }}
                  icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>}>
                  Add field
                </Button>
              </div>

              {table.fields.map((f: FieldSchema) => (
                <div key={f.name} className={`pgl-field-row${f.system ? ' pgl-field-row--system' : ''}`}>
                  <span className="pgl-field-row__name">{f.name}</span>
                  <span className="pgl-field-row__type">{f.type}</span>
                  <span className="pgl-field-row__badges">{[f.primary_key && 'PK', f.auto_increment && 'auto'].filter(Boolean).join(' · ')}</span>
                  {f.system
                    ? <span className="pgl-field-row__system">system</span>
                    : <button className="pgl-field-row__delete" onClick={() => deleteField(tableName, f.name)} title="Delete field">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                  }
                </div>
              ))}

              {addFieldTable === tableName && (
                <div className="pgl-add-field-form pgl-add-field-form--visible">
                  <input ref={newFieldRef} className="pgl-inline-input" style={{ width: 180 }} placeholder="field name"
                    value={newFieldName} onChange={e => setNewFieldName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submitAddField(tableName); if (e.key === 'Escape') { setAddFieldTable(null); setNewFieldName('') } }} />
                  <select className="pgl-type-select" value={newFieldType} onChange={e => setNewFieldType(e.target.value)}>
                    {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Button variant="primary" size="xs" onClick={() => submitAddField(tableName)}>Add</Button>
                  <Button variant="ghost"   size="xs" onClick={() => { setAddFieldTable(null); setNewFieldName('') }}>Cancel</Button>
                  {fieldFormErr && <span className="pgl-inline-error">{fieldFormErr}</span>}
                </div>
              )}
            </div>
          ))
      }
    </div>
  )
}
