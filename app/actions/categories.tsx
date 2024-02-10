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

    const {status} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${category.storeId}/categories`,category)
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
    const category = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/categories/${categoryId}`)
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
    const {data} =  await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/categories`)
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
    
    const {status} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${updatedcategory.storeId}/categories/${updatedcategory.categoryId}`,updatedcategory)
    return status
}

export const deleteCategory = async (
    categoryId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        const storeByUserId = await getStoreById(userId, storeId)
        const products = await getProducts(storeId)
        const isCategory = products.filter((product : Product) => product.categoryId._id === categoryId)

        if (!userId) {
            const status = 401
            const message = 'Unauthorized'
            return {status, message}
        }
        else if (!categoryId) {
            const status = 400
            const message = 'Category ID required'
            return {status, message}
        }
        else if (!storeByUserId) {
            const status = 403
            const message = 'Forbidden'
            return {status, message}
        } else if (isCategory.length > 0) {
            const status = 400
            const message = 'Make sure you removed all products using this category first.'
            return {status, message}
        } else {
            const {status} =  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/categories/${categoryId}`)
            const message = "Category deleted."
            return {status, message}
        }

}
