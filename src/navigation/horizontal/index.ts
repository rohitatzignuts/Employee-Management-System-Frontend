import type { HorizontalNavItems } from '@layouts/types'
import { useAuthStore } from '@/store/useAuthStore'

const aStore = useAuthStore()
let defaultNavItems: HorizontalNavItems = [];

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
] 

if(aStore.userRole === 'admin'){
  defaultNavItems = navItems as HorizontalNavItems;
}else{
  defaultNavItems = navItems.filter(item => item.title !== 'Companies') as HorizontalNavItems; 
}

export default defaultNavItems;