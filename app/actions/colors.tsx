"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

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
    const {data} =  await axios(`http://localhost:5000/api/${storeId}/colors`)
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
    const colors = await axios(`http://localhost:5000/api/${storeId}/colors/${colorId}`)
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

    const {status} = await axios.post(`http://localhost:5000/api/${color.storeId}/colors`,color)
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
    
    const {status} = await axios.patch(`http://localhost:5000/api/${updatedcolor.storeId}/colors/${updatedcolor.colorId}`,updatedcolor)
    return status
}

export const deleteColor = async (
    colorId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!colorId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`http://localhost:5000/api/${storeId}/colors/${colorId}`)
    return status
}
