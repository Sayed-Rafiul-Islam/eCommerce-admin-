import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/main-nav'
import StoreSwitcher from '@/components/store-switcher'
import { getStores } from '@/app/actions/store'

export default async function Navbar() {

    const { userId } = auth()
    
    if (!userId) {
        redirect("/sign-in")
    }

    const stores = await getStores()
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4 '>
        <div>
            <StoreSwitcher items={stores} />
        </div>
        <div>
            <MainNav />
        </div>
        <div className='ml-auto flex items-center space-x-4'>
            <UserButton afterSignOutUrl='/' />
        </div>
        
      </div>
    </div>
  )
}
