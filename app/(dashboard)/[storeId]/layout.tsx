import {  getStoreById } from "@/app/actions/store"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
    params
} : {
    children : React.ReactNode,
    params : { storeId : string }
}) {
    const { userId } = auth()
    
    if (!userId) {
        redirect('/sign-in')
    }

    const store = await getStoreById(userId ,params.storeId)

    if(!store) {
      redirect('/')
    }
  return (
    <>
      <h1>This will be a navbar</h1>
      {children}
    </>
  )
}
