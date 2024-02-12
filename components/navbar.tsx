import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/main-nav'
import StoreSwitcher from '@/components/store-switcher'
import { getStores } from '@/app/actions/store'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import NavbarToggle from './ui/navbar-toggle'

export default async function Navbar() {

    const { userId } = auth()
    
    if (!userId) {
        redirect("/sign-in")
    }

    const stores = await getStores()
  return (
    <div className='border-b'>
      <div className='flex  h-16 items-center px-4'>
      <div className='h-8 flex items-center w-full md:hidden lg:hidden'>
            <NavbarToggle />
        </div>
        <div className=''>
            <StoreSwitcher items={stores} />
        </div>
        <div className='hidden lg:block ml-4'>
            <MainNav />
        </div>
        <div className='lg:ml-auto md:ml-auto ml-4 flex items-center space-x-4'>
            <ThemeToggle />
            <UserButton afterSignOutUrl='/' />
        </div>
      </div>
      <div className='ml-10 h-8 mt-2 md:block hidden lg:hidden w-3/4'>
            <MainNav />
        </div>

    </div>
  )
}
