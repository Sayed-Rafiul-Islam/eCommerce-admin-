"use client"
import SignUpForm from "@/components/SignUpForm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import LogInForm from "@/components/LogInForm";


export default function Authentication() {
    const [account,setAccount] = useState(true)
    const [user,setUser] = useState<boolean | null>(null)
    useEffect(()=>{
        const accessToken : string | null = localStorage.getItem("accessToken")
        const isUser = accessToken ? true : false
        setUser(isUser)
    },[user])

    const {logout} = useUserAuth()

  return (
    <div className='flex items-center justify-center h-full'>


        {
            account ? 
              <div>
                <h1 className="text-4xl font-bold text-indigo-400 text-center">Log In</h1>
                <LogInForm />
                <p>Don't have an account? Go to <Button onClick={()=>setAccount(false)} className="text-blue-500" variant='link'>Sign Up</Button></p>
              </div>
            :
              <div>
                <h1 className="text-4xl font-bold text-indigo-400 text-center">Sign Up</h1>
                <SignUpForm />
                <p>Already have an account? Go to <Button onClick={()=>setAccount(true)} className="text-blue-500" variant='link'>Log In</Button></p>
              </div>
           
        }
    {/* <h1 className='text-3xl'>SignUp</h1> */}
    
    
  </div>
  )
}
