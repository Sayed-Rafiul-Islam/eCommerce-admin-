import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function DashboardLayout({
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
  return (
    <div>
      
    </div>
  )
}
