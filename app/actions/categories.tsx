"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

interface newCategory {
    storeId : string | string[],
    name : string,
    billboardId : string | string[],
    createdAt : Date,
    updatedAt : Date
}
interface updatedCategory {
    categoryId : string | string[],
    storeId : string | string[]
    name : string,
    billboardId : string,
    updatedAt : Date
}


export const createCategory = async (
    category : newCategory
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!category.name || !category.storeId || !category.billboardId) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, category.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`http://localhost:5000/api/${category.storeId}/categories`,category)
    return status
}

export const getCategoryById = async (
    categoryId: string,
    storeId : string
    ) => {
        if (!categoryId) {
            const status = 400
            return status
        }
    const category = await axios(`http://localhost:5000/api/${storeId}/categories/${categoryId}`)
    return category.data
}


export const getCategories = async (
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
    const {data} =  await axios(`http://localhost:5000/api/${storeId}/categories`)
    return data
}

export const updateCategory = async (
    updatedcategory : updatedCategory,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedcategory.categoryId || !updatedcategory.billboardId || !updatedcategory.name) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedcategory.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`http://localhost:5000/api/${updatedcategory.storeId}/categories/${updatedcategory.categoryId}`,updatedcategory)
    return status
}

export const deleteCategory = async (
    categoryId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!categoryId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`http://localhost:5000/api/${storeId}/categories/${categoryId}`)
    return status
}
