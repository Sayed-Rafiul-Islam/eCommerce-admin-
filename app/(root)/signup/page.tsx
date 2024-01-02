"use client"
import SignUpForm from "@/components/SignUpForm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";


export default function SignUp() {
    const [user,setUser] = useState<boolean | null>(null)
    useEffect(()=>{
        const accessToken : string | null = localStorage.getItem("accessToken")
        const isUser = accessToken ? true : false
        setUser(isUser)
    },[user])

    const {logout} = useUserAuth()

  return (
    <div className='flex flex-col gap-4'>
        {
            user ? 
            <>
              <h1 className='text-3xl text-center text-green-600'>Signed In</h1>
              <Button className="w-1/12 mx-auto" onClick={logout}>Log out</Button>
            </>
            :
            <>
              <h1 className='text-3xl text-center '>Sign Up</h1>
              <SignUpForm />
            </>
        }
    {/* <h1 className='text-3xl'>SignUp</h1> */}
    
    
  </div>
  )
}
