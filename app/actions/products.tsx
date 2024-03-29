"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

interface NewProducts {
    name : string,
    price : number,
    quantity : number,
    images : { url : string}[],
    storeId : string | string[],
    categoryId : string,
    sizeId : string ,
    colorId : string,
    isFeatured : boolean | undefined,
    isArchieved : boolean | undefined,
    createdAt : Date,
    updatedAt : Date,
}
interface UpdatedProducts {
    productId : string | string[],
    name : string,
    price : number,
    quantity : number,
    images : { url : string}[],
    storeId : string | string[],
    categoryId : string,
    sizeId : string,
    colorId : string,
    isFeatured : boolean | undefined,
    isArchieved : boolean | undefined,
    updatedAt : Date,
}


export const getProducts = async (
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
    const {data} =  await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products`)
    return data
}

export const getProductById = async (
    productsId: string,
    storeId : string
    ) => {
        if (!productsId) {
            const status = 400
            return status
        }
    const products = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products/${productsId}`)
    return products.data
}

export const createProduct = async (
    product : NewProducts
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!product.name || 
        !product.categoryId || 
        !product.colorId || 
        !product.images || 
        product.images.length === 0 || 
        !product.price || 
        !product.quantity || 
        !product.sizeId || 
        !product.storeId) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, product.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${product.storeId}/products`,product)
    return status
}


export const updateProduct = async (
    updatedProducts : UpdatedProducts,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedProducts.name || 
        !updatedProducts.categoryId || 
        !updatedProducts.colorId || 
        !updatedProducts.images || 
        updatedProducts.images.length === 0 || 
        !updatedProducts.price || 
        !updatedProducts.quantity || 
        !updatedProducts.sizeId || 
        !updatedProducts.storeId || 
        !updatedProducts.productId ) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedProducts.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${updatedProducts.storeId}/products/${updatedProducts.productId}`,updatedProducts)
    return status
}

export const deleteProduct = async (
    productsId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!productsId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products/${productsId}`)
    return status
}
