import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Companies',
    to: { name: 'companies' },
    icon: { icon: 'tabler-building' },  
  },
  {
    title: 'Employees',
    to: { name: 'employees' },
    icon: { icon: 'tabler-user' },
  },
] as VerticalNavItems
