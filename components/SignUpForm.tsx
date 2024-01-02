"use client"

import {  useUserAuth } from "@/app/(root)/context/AuthContext"
import { useState } from "react"

export default function SignUpForm() {

    const {signup} = useUserAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ message, setMessage] = useState('')

    const handleSubmit = async () => {
        setMessage("Signing up...")
        if (name === '' || email === '' || password === '') {
            setMessage("Fill in all the fields")
        }
        else {
            const message = await signup(email,name,password)
            setMessage(message)
        } 
    }
  return (
    <div className="flex flex-col w-1/2 mx-auto gap-4 bg-gray-400 p-4">
        <input className="text-black" type="text" value={name} onChange={(e)=> setName(e.target.value)} />
        <input className="text-black" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
        <input className="text-black" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />

        <button onClick={handleSubmit}>
            Sign Up
        </button>

        <p>
            {message}
        </p>
      
    </div>
  )
}
