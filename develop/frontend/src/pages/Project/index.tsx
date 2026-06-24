import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar, NavItem } from '@pergola/engine'
import { api }       from '../../lib/api'
import Databases     from './Databases'
import Layouts       from './Layouts'
import Scripts       from './Scripts'
import About         from './About'

type Section = 'databases' | 'layouts' | 'scripts' | 'about'

const DB_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
)
const LAYOUT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
)
const SCRIPT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)
const ABOUT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
  </svg>
)

export default function Project() {
  const navigate  = useNavigate()
  const [section, setSection] = useState<Section>('databases')
  const [appName, setAppName] = useState('…')

  useEffect(() => {
    api.status().then(s => {
      if (!s.open) { navigate('/'); return }
      setAppName(s.meta?.name ?? '…')
    })
  }, [navigate])

  return (
    <div className="pgl-project">
      <Sidebar appName={appName}>
        <NavItem icon={DB_ICON}     active={section === 'databases'} onClick={() => setSection('databases')}>Databases</NavItem>
        <NavItem icon={LAYOUT_ICON} active={section === 'layouts'}   onClick={() => setSection('layouts')}>Layouts</NavItem>
        <NavItem icon={SCRIPT_ICON} active={section === 'scripts'}   onClick={() => setSection('scripts')}>Scripts</NavItem>
        <NavItem icon={ABOUT_ICON}  active={section === 'about'}     onClick={() => setSection('about')}>About</NavItem>
      </Sidebar>

      <main className="pgl-project__main">
        <div className={`pgl-project__section ${section === 'databases' ? 'pgl-project__section--active' : ''}`}>
          <Databases />
        </div>
        <div className={`pgl-project__section ${section === 'layouts' ? 'pgl-project__section--active' : ''}`}>
          <Layouts />
        </div>
        <div className={`pgl-project__section ${section === 'scripts' ? 'pgl-project__section--active' : ''}`}>
          <Scripts />
        </div>
        <div className={`pgl-project__section ${section === 'about' ? 'pgl-project__section--active' : ''}`}>
          <About />
        </div>
      </main>
    </div>
  )
}
