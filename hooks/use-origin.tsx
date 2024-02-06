"use client"
import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false)
    // const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ''
    const origin = 'http://localhost:5000/api'

    useEffect(()=>{
        setMounted(true)
    },[])

    if(!mounted) {
        return ''
    }

    return origin
}