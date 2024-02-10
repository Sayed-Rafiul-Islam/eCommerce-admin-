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
    categoryId : { _id : string}
    sizeId : { _id : string} ,
    colorId : { _id : string}
    isFeatured : boolean | undefined,
    isArchieved : boolean | undefined,
    createdAt : Date,
    updatedAt : Date,
}

interface NewColor {
    storeId : string | string[]
    name : string,
    value : string,
    createdAt : Date,
    updatedAt : Date
}
interface UpdatedColor {
    colorId : string | string[],
    storeId : string | string[]
    name : string,
    value : string,
    updatedAt : Date
}


export const getColors = async (
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
    const {data} =  await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/colors`)
    return data
}

export const getColorById = async (
    colorId: string,
    storeId : string
    ) => {
        if (!colorId) {
            const status = 400
            return status
        }
    const colors = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/colors/${colorId}`)
    return colors.data
}

export const createColor = async (
    color : NewColor
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!color.name || !color.storeId || !color.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, color.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${color.storeId}/colors`,color)
    return status
}


export const updateColor = async (
    updatedcolor : UpdatedColor,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedcolor.colorId || !updatedcolor.storeId || !updatedcolor.name || !updatedcolor.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedcolor.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${updatedcolor.storeId}/colors/${updatedcolor.colorId}`,updatedcolor)
    return status
}

export const deleteColor = async (
    colorId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        const storeByUserId = await getStoreById(userId, storeId)
        const products = await getProducts(storeId)
        const isColor = products.filter((product : Product) => product.colorId._id === colorId)
        if (!userId) {
            const status = 401
            const message = 'Unauthorized'
            return {status, message}
        }
        else if (!colorId) {
            const status = 400
            const message = 'Color ID required'
            return {status, message}
        }
        else if (!storeByUserId) {
            const status = 403
            const message = 'Forbidden'
            return {status, message}
        }
        else if (isColor.length > 0) {
            const status = 400
            const message = 'Make sure you removed all products using this color first.'
            return {status, message}
        } else {
            const {status} =  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/colors/${colorId}`)
            const message = "Color deleted."
            return {status, message}
        }    
}
