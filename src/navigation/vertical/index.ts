import type { VerticalNavItems } from '@/@layouts/types'
import { useAuthStore } from '@/store/useAuthStore'

const aStore = useAuthStore()
let defaultNavItems: VerticalNavItems = [];
const navItems =[
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Companies',
    to: { name: 'companies' },
    icon: { icon: 'tabler-building-skyscraper' },
  },
  {
    title: 'Employees',
    to: { name: 'employees' },
    icon: { icon: 'tabler-users' },
  },
  {
    title: 'Jobs',
    to: { name: 'jobs' },
    icon: { icon: 'tabler-file' },
  },
  {
    title: 'Applicants',
    to: { name: 'applicants' },
    icon: { icon: 'tabler-users-group' },
  },
] 

// hide companies nav item when user is not super admin
if(aStore.userRole === 'admin'){
  defaultNavItems = navItems as VerticalNavItems;
}else{
  defaultNavItems = navItems.filter(item => item.title !== 'Companies') as VerticalNavItems; 
}

export default defaultNavItems;