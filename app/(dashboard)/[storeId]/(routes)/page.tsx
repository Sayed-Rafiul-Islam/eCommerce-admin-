import { getStoreById } from '@/app/actions/store'
import { auth } from '@clerk/nextjs'
import React from 'react'

interface DashboardPageProps {
    params : { storeId : string }
}

const DashboardPage : React.FC<DashboardPageProps> = async ({
    params
}) => {
    const { userId } = auth()
    const store = await getStoreById(userId, params.storeId)
  return (
    <div>
      active store : {store?.name}
    </div>
  )
}

export default DashboardPage
