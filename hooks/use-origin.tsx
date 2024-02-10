"use client"
import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false)
    const origin = 'https://e-commerce-admin-server-seven.vercel.app/api'

    useEffect(()=>{
        setMounted(true)
    },[])

    if(!mounted) {
        return ''
    }

    return origin
}