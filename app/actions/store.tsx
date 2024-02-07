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
    userId: string | null, 
    storeId: string | string[]
    ) => {
    const store = await axios(`http://localhost:5000/api/getStoresbyId?storeId=${storeId}&userId=${userId}`)
    return store.data[0]
}


export const getFirstStore = async (
    userId: string,
    ) => {
    const {data} =  await axios(`http://localhost:5000/api/getFirstStore?userId=${userId}`)
    return data[0]
}

export const getStores = async () => {
    const {userId} =auth()
    const {data} =  await axios(`http://localhost:5000/api/getStores?userId=${userId}`)
    return data
}

export const UpdateStores = async (
    storeId : string[] | string,
    name : string
    ) => {
        const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!name) {
        const status = 400
        return status
    }
    if (!storeId) {
        const status = 400
        return status
    }
    
    const {data,status} = await axios.patch(`http://localhost:5000/api/updateStore`,{userId,storeId,name})
    return status
}

export const DeleteStores = async (
    storeId: string | string[],
    ) => {
    const { userId } = auth()
    const {data} =  await axios.delete(`http://localhost:5000/api/deleteStore?storeId=${storeId}&userId=${userId}`)
    return data
}
