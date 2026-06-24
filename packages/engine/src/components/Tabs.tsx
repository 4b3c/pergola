import React, { useState } from 'react'
import type { PergolaStyle } from '../types'
import { toStyle } from '../style'

export interface Tab {
  key: string
  label: string
  content: React.ReactNode
}

export interface TabsProps extends PergolaStyle {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (key: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, activeTab: controlledTab, onTabChange, className, ...styling }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.key ?? '')
  const active = controlledTab ?? internalTab

  const handleChange = (key: string) => {
    setInternalTab(key)
    onTabChange?.(key)
  }

  return (
    <div className={['pgl-tabs', className ?? ''].filter(Boolean).join(' ')} style={toStyle(styling as PergolaStyle)}>
      <div className="pgl-tabs__list" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.key} type="button" role="tab"
            className={['pgl-tabs__tab', tab.key === active ? 'pgl-tabs__tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => handleChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pgl-tabs__panel">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  )
}
