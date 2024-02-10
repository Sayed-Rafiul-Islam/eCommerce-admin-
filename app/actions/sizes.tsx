"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"
import { getProducts } from "./products"

interface Product {
    name : string,
    price : number,
    quantity : number,
    images : { url : string}[],
    storeId : string | string[],
    categoryId : string,
    sizeId : { _id : string} ,
    colorId : string,
    isFeatured : boolean | undefined,
    isArchieved : boolean | undefined,
    createdAt : Date,
    updatedAt : Date,
}

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
    const {data} =  await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/sizes`)
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
    const sizes = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/sizes/${sizesId}`)
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

    const {status} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${sizes.storeId}/sizes`,sizes)
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
    
    const {status} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${updatedsizes.storeId}/sizes/${updatedsizes.sizeId}`,updatedsizes)
    return status
}

export const deleteSize = async (
    sizesId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        const storeByUserId = await getStoreById(userId, storeId)
        const products = await getProducts(storeId)
        const isSize = products.filter((product : Product) => product.sizeId._id === sizesId)
        if (!userId) {
            const status = 401
            const message = 'Unauthorized'
            return {status, message}
        }
        else if (!sizesId) {
            const status = 400
            const message = 'Size ID required'
            return {status, message}
        }
        else if (!storeByUserId) {
            const status = 403
            const message = 'Forbidden'
            return {status, message}
        }
        else if (isSize.length > 0) {
            const status = 400
            const message = 'Make sure you removed all products using this size first.'
            return {status, message}
        } else {
            const {status} =  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/sizes/${sizesId}`)
            const message = "Size deleted."
            return {status, message}
        }
 
}
