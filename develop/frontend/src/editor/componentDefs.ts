import type { ComponentDef, PropDef } from './types'

// Common PergolaStyle prop groups reused across component defs
const LAYOUT_PROPS: PropDef[] = [
  { key: 'padding',  label: 'Padding',  type: 'number', group: 'layout' },
  { key: 'paddingX', label: 'Padding X', type: 'number', group: 'layout' },
  { key: 'paddingY', label: 'Padding Y', type: 'number', group: 'layout' },
  { key: 'gap',      label: 'Gap',      type: 'number', group: 'layout' },
  { key: 'width',    label: 'Width',    type: 'text',   group: 'layout' },
  { key: 'height',   label: 'Height',   type: 'text',   group: 'layout' },
]

const BG_PROP: PropDef   = { key: 'bg',        label: 'Background', type: 'color',  group: 'background' }
const TEXT_COLOR: PropDef = { key: 'textColor', label: 'Text color', type: 'color',  group: 'typography' }

const BORDER_PROPS: PropDef[] = [
  { key: 'border',       label: 'Border',        type: 'boolean', group: 'border' },
  { key: 'borderColor',  label: 'Border color',  type: 'color',   group: 'border' },
  { key: 'borderWidth',  label: 'Border width',  type: 'number',  group: 'border' },
  { key: 'borderRadius', label: 'Border radius', type: 'number',  group: 'border' },
]

const SHADOW_PROP: PropDef = {
  key: 'shadow', label: 'Shadow', type: 'select', group: 'effects',
  options: [
    { value: 'none', label: 'None' }, { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },  { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },  { value: 'xl', label: 'XL' },
  ],
}

const OPACITY_PROP: PropDef = {
  key: 'opacity', label: 'Opacity', type: 'number', group: 'effects', min: 0, max: 1, step: 0.05,
}

export const COMPONENT_DEFS: Record<string, ComponentDef> = {

  // ── Layout ──────────────────────────────────────────────────────────────────
  Stack: {
    label: 'Stack', category: 'layout', acceptsChildren: true,
    icon: 'M3 5h18M3 10h18M3 15h18M3 20h18',
    defaultProps: { direction: 'col', gap: 12, padding: 16 },
    propDefs: [
      { key: 'direction', label: 'Direction', type: 'select', group: 'layout',
        options: [{ value: 'col', label: 'Column' }, { value: 'row', label: 'Row' }] },
      { key: 'gap', label: 'Gap', type: 'number', group: 'layout' },
      { key: 'align', label: 'Align items', type: 'select', group: 'layout',
        options: [{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' },
                  { value: 'flex-end', label: 'End' }, { value: 'stretch', label: 'Stretch' }] },
      { key: 'justify', label: 'Justify', type: 'select', group: 'layout',
        options: [{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' },
                  { value: 'flex-end', label: 'End' }, { value: 'space-between', label: 'Space between' }] },
      { key: 'wrap', label: 'Wrap', type: 'boolean', group: 'layout' },
      ...LAYOUT_PROPS, BG_PROP, ...BORDER_PROPS, SHADOW_PROP,
    ],
  },

  Card: {
    label: 'Card', category: 'layout', acceptsChildren: true,
    icon: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z',
    defaultProps: { padding: 20, borderRadius: 12, shadow: 'sm' },
    propDefs: [
      BG_PROP, ...BORDER_PROPS, SHADOW_PROP, ...LAYOUT_PROPS,
    ],
  },

  Grid: {
    label: 'Grid', category: 'layout', acceptsChildren: true,
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    defaultProps: { columns: 2, gap: 16, padding: 16 },
    propDefs: [
      { key: 'columns', label: 'Columns', type: 'number', group: 'layout', min: 1, max: 12 },
      ...LAYOUT_PROPS, BG_PROP, ...BORDER_PROPS,
    ],
  },

  Divider: {
    label: 'Divider', category: 'layout', acceptsChildren: false,
    icon: 'M3 12h18',
    defaultProps: {},
    propDefs: [
      { key: 'direction', label: 'Direction', type: 'select', group: 'layout',
        options: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }] },
      { key: 'bg', label: 'Color', type: 'color', group: 'background' },
    ],
  },

  // ── Content ──────────────────────────────────────────────────────────────────
  Text: {
    label: 'Text', category: 'content', acceptsChildren: false,
    icon: 'M4 7V4h16v3M9 20h6M12 4v16',
    defaultProps: { variant: 'body' },
    defaultContent: 'Text content',
    propDefs: [
      { key: '_content', label: 'Content', type: 'textarea', group: 'content', isContent: true },
      { key: 'variant', label: 'Variant', type: 'select', group: 'content',
        options: [{ value: 'display', label: 'Display' }, { value: 'heading', label: 'Heading' },
                  { value: 'subheading', label: 'Subheading' }, { value: 'body', label: 'Body' },
                  { value: 'label', label: 'Label' }, { value: 'caption', label: 'Caption' },
                  { value: 'code', label: 'Code' }] },
      { key: 'align', label: 'Align', type: 'select', group: 'typography',
        options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' }] },
      TEXT_COLOR,
      { key: 'fontSize',    label: 'Font size',   type: 'number', group: 'typography' },
      { key: 'fontWeight',  label: 'Font weight', type: 'select', group: 'typography',
        options: [{ value: '400', label: 'Regular' }, { value: '500', label: 'Medium' },
                  { value: '600', label: 'Semibold' }, { value: '700', label: 'Bold' },
                  { value: '800', label: 'Extrabold' }] },
      { key: 'italic',    label: 'Italic',    type: 'boolean', group: 'typography' },
      { key: 'underline', label: 'Underline', type: 'boolean', group: 'typography' },
      { key: 'truncate',  label: 'Truncate',  type: 'boolean', group: 'typography' },
      OPACITY_PROP,
    ],
  },

  Badge: {
    label: 'Badge', category: 'content', acceptsChildren: false,
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    defaultProps: { variant: 'default' },
    defaultContent: 'Badge',
    propDefs: [
      { key: '_content', label: 'Text', type: 'text', group: 'content', isContent: true },
      { key: 'variant', label: 'Variant', type: 'select', group: 'content',
        options: [{ value: 'default', label: 'Default' }, { value: 'accent', label: 'Accent' },
                  { value: 'danger', label: 'Danger' }, { value: 'success', label: 'Success' }] },
    ],
  },

  Tag: {
    label: 'Tag', category: 'content', acceptsChildren: false,
    icon: 'M7 20L11 4M17 20L21 4M2 9h20M2 15h20',
    defaultProps: {},
    defaultContent: 'Tag',
    propDefs: [
      { key: '_content', label: 'Text', type: 'text', group: 'content', isContent: true },
      BG_PROP, TEXT_COLOR, ...BORDER_PROPS,
    ],
  },

  Avatar: {
    label: 'Avatar', category: 'content', acceptsChildren: false,
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    defaultProps: { size: 'md' },
    defaultContent: 'AB',
    propDefs: [
      { key: 'name', label: 'Name', type: 'text', group: 'content' },
      { key: 'size', label: 'Size', type: 'select', group: 'content',
        options: ['xs','sm','md','lg','xl'].map(v => ({ value: v, label: v.toUpperCase() })) },
      BG_PROP, TEXT_COLOR,
    ],
  },

  // ── Form ─────────────────────────────────────────────────────────────────────
  Button: {
    label: 'Button', category: 'form', acceptsChildren: false,
    icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5',
    defaultProps: { variant: 'primary', size: 'md' },
    defaultContent: 'Click me',
    propDefs: [
      { key: '_content', label: 'Label', type: 'text', group: 'content', isContent: true },
      { key: 'variant', label: 'Variant', type: 'select', group: 'content',
        options: ['primary','secondary','ghost','danger','link'].map(v => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
      { key: 'size', label: 'Size', type: 'select', group: 'content',
        options: ['xs','sm','md','lg','xl'].map(v => ({ value: v, label: v.toUpperCase() })) },
      BG_PROP, TEXT_COLOR, ...BORDER_PROPS, SHADOW_PROP, OPACITY_PROP,
    ],
  },

  Input: {
    label: 'Input', category: 'form', acceptsChildren: false,
    icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    defaultProps: {},
    propDefs: [
      { key: 'label',       label: 'Label',       type: 'text', group: 'content' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', group: 'content' },
      BG_PROP, ...BORDER_PROPS,
    ],
  },

  Textarea: {
    label: 'Textarea', category: 'form', acceptsChildren: false,
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    defaultProps: { rows: 4 },
    propDefs: [
      { key: 'label',       label: 'Label',       type: 'text', group: 'content' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', group: 'content' },
      { key: 'rows',        label: 'Rows',        type: 'number', group: 'content', min: 2, max: 20 },
      BG_PROP, ...BORDER_PROPS,
    ],
  },

  Select: {
    label: 'Select', category: 'form', acceptsChildren: false,
    icon: 'm6 9 6 6 6-6',
    defaultProps: { options: [] },
    propDefs: [
      { key: 'label',       label: 'Label',       type: 'text', group: 'content' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', group: 'content' },
      BG_PROP, ...BORDER_PROPS,
    ],
  },

  Toggle: {
    label: 'Toggle', category: 'form', acceptsChildren: false,
    icon: 'M9 12l2 2 4-4',
    defaultProps: { checked: false },
    propDefs: [
      { key: 'label',   label: 'Label',   type: 'text',    group: 'content' },
      { key: 'checked', label: 'Checked', type: 'boolean', group: 'content' },
    ],
  },

  Checkbox: {
    label: 'Checkbox', category: 'form', acceptsChildren: false,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    defaultProps: { checked: false },
    propDefs: [
      { key: 'label',   label: 'Label',   type: 'text',    group: 'content' },
      { key: 'checked', label: 'Checked', type: 'boolean', group: 'content' },
    ],
  },

  Slider: {
    label: 'Slider', category: 'form', acceptsChildren: false,
    icon: 'M18 20V10M12 20V4M6 20v-6',
    defaultProps: { min: 0, max: 100, value: 50, showValue: true },
    propDefs: [
      { key: 'label', label: 'Label', type: 'text', group: 'content' },
      { key: 'min',   label: 'Min',   type: 'number', group: 'content' },
      { key: 'max',   label: 'Max',   type: 'number', group: 'content' },
      { key: 'value', label: 'Value', type: 'number', group: 'content' },
    ],
  },

  // ── Display ───────────────────────────────────────────────────────────────────
  EmptyState: {
    label: 'Empty state', category: 'display', acceptsChildren: false,
    icon: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-.17 3.73 3.73 0 003.89-1.61l.54-.82a1 1 0 011.14 0l.54.82A3.73 3.73 0 0015 5.83 1 1 0 0116 6z',
    defaultProps: {},
    defaultContent: '',
    propDefs: [
      { key: 'title', label: 'Title', type: 'text', group: 'content' },
      { key: 'body',  label: 'Body',  type: 'textarea', group: 'content' },
      TEXT_COLOR, OPACITY_PROP,
    ],
  },

  Spinner: {
    label: 'Spinner', category: 'display', acceptsChildren: false,
    icon: 'M21 12a9 9 0 11-6.22-8.55',
    defaultProps: { size: 'md' },
    propDefs: [
      { key: 'size', label: 'Size', type: 'select', group: 'content',
        options: ['xs','sm','md','lg'].map(v => ({ value: v, label: v.toUpperCase() })) },
    ],
  },
}

export const CATEGORY_ORDER: Array<ComponentDef['category']> = ['layout', 'content', 'form', 'display']

export const CATEGORY_LABELS: Record<ComponentDef['category'], string> = {
  layout: 'Layout', content: 'Content', form: 'Form', display: 'Display',
}

export const CONTAINER_TYPES = new Set(
  Object.entries(COMPONENT_DEFS)
    .filter(([, d]) => d.acceptsChildren)
    .map(([k]) => k)
)
