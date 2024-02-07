"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

interface NewSizes {
    storeId : string | string[]
    name : string,
    value : string,
    createdAt : Date,
    updatedAt : Date
}
interface UpdatedSizes {
    sizeId : string | string[],
    storeId : string | string[]
    name : string,
    value : string,
    updatedAt : Date
}


export const getSizes = async (
    storeId : string | string[]
) => {
    const {userId} = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!storeId) {
        const status = 400
        return status
    }
    const {data} =  await axios(`hhttps://e-commerce-admin-server-seven.vercel.app/api/${storeId}/sizes`)
    return data
}

export const getSizeById = async (
    sizesId: string,
    storeId : string
    ) => {
        if (!sizesId) {
            const status = 400
            return status
        }
    const sizes = await axios(`hhttps://e-commerce-admin-server-seven.vercel.app/api/${storeId}/sizes/${sizesId}`)
    return sizes.data
}

export const createSize = async (
    sizes : NewSizes
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!sizes.name || !sizes.storeId || !sizes.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, sizes.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`hhttps://e-commerce-admin-server-seven.vercel.app/api/${sizes.storeId}/sizes`,sizes)
    return status
}


export const updateSize = async (
    updatedsizes : UpdatedSizes,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedsizes.sizeId || !updatedsizes.storeId || !updatedsizes.name || !updatedsizes.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedsizes.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`hhttps://e-commerce-admin-server-seven.vercel.app/api/${updatedsizes.storeId}/sizes/${updatedsizes.sizeId}`,updatedsizes)
    return status
}

export const deleteSize = async (
    sizesId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!sizesId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`hhttps://e-commerce-admin-server-seven.vercel.app/api/${storeId}/sizes/${sizesId}`)
    return status
}
