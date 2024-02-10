"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"
import { getCategories } from "./categories"
import { getProducts } from "./products"

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

interface Category {
    storeId : string | string[],
    name : string,
    billboardId : { _id : string},
    createdAt : Date,
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

    const {status} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${billboard.storeId}/billboards`,billboard)
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
    const billboard = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/billboards/${billboardId}`)
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
    const {data} =  await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/billboards`)
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
    
    const {status} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${updatedBillboard.storeId}/billboards/${updatedBillboard.billboardId}`,updatedBillboard)
    return status
}

export const deleteBillboard = async (
    billboardId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        const storeByUserId = await getStoreById(userId, storeId)

        const categories = await getCategories(storeId)
        const isBillboard = categories.filter((category : Category) => category.billboardId._id === billboardId)

        if (!userId) {
            const status = 401
            const message = 'Unauthorized'
            return {status, message}
        }
        else if (!billboardId) {
            const status = 400
            const message = 'Billboard ID required'
            return {status, message}
        }
        else if (!storeByUserId) {
            const status = 403
            const message = 'Forbidden'
            return {status, message}
        } else if (isBillboard.length > 0) {
            const status = 400
            const message = 'Make sure you removed all products and categories first.'
            return {status, message}
        } else {
            const {status} =  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/billboards/${billboardId}`)
            const message = 'Billboard deleted.'
            return {status, message}
        }

}
