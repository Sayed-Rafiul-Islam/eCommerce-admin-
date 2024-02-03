import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import { getFirstStore } from '@/app/actions/store'

export default async function SetupLayout({
    children
} : {
    children : React.ReactNode
}) {
    const {userId} = auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const store = await getFirstStore(userId)

    if(store) {
        redirect(`/${store._id}`)
    }
  return (
    <>
      {children}
    </>
  )
}
