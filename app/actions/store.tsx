"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"


export const addStore = async (name : string) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!name) {
        const status = 400
        return status
    }

    const {data} = await axios.post(`http://localhost:5000/api/createStore`,{userId,name})
    return data
}

export const getStoreById = async (
    userId: string, 
    storeId: string
    ) => {
    const stores = await axios(`http://localhost:5000/api/getStoresbyId?storeId=${storeId}&userId=${userId}`)
    return stores
}


export const getFirstStore = async (
    userId: string,
    ) => {
    const {data} =  await axios(`http://localhost:5000/api/getFirstStore?userId=${userId}`)
    return data
}
