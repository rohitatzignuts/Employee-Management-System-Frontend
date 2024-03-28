import type { HorizontalNavItems } from '@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Companies',
    to: { name: 'companies' },
    icon: { icon: 'tabler-file' },
  },
] as HorizontalNavItems
