"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

interface newBillboard {
    storeId : string | string[]
    label : string,
    imageUrl : string,
    createdAt : Date,
    updatedAt : Date
}
interface updatedBillboard {
    billboardId : string | string[],
    storeId : string | string[]
    label : string,
    imageUrl : string,
    updatedAt : Date
}


export const createBillboard = async (
    billboard : newBillboard
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!billboard.label || !billboard.storeId || !billboard.imageUrl) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, billboard.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`https://e-commerce-admin-server-seven.vercel.app/api/${billboard.storeId}/billboards`,billboard)
    return status
}

export const getBillboardById = async (
    billboardId: string,
    storeId : string
    ) => {
        if (!billboardId) {
            const status = 400
            return status
        }
    const billboard = await axios(`https://e-commerce-admin-server-seven.vercel.app/api/${storeId}/billboards/${billboardId}`)
    return billboard.data
}


export const getBillboards = async (
    storeId : string | string[]
) => {
    const {userId} =auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!storeId) {
        const status = 400
        return status
    }
    const {data} =  await axios(`https://e-commerce-admin-server-seven.vercel.app/api/${storeId}/billboards`)
    return data
}

export const updateBillboard = async (
    updatedBillboard : updatedBillboard,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedBillboard.billboardId || !updatedBillboard.imageUrl || !updatedBillboard.label) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedBillboard.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`https://e-commerce-admin-server-seven.vercel.app/api/${updatedBillboard.storeId}/billboards/${updatedBillboard.billboardId}`,updatedBillboard)
    return status
}

export const deleteBillboard = async (
    billboardId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!billboardId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`https://e-commerce-admin-server-seven.vercel.app/api/${storeId}/billboards/${billboardId}`)
    return status
}
