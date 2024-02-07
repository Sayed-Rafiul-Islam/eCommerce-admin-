"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"
import { getStoreById } from "./store"

interface NewOrder {
    storeId : string | string[]
    name : string,
    value : string,
    createdAt : Date,
    updatedAt : Date
}
interface UpdatedOrder {
    OrderId : string | string[],
    storeId : string | string[]
    name : string,
    value : string,
    updatedAt : Date
}


export const getOrders = async (
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
    const {data} =  await axios(`http://localhost:5000/api/${storeId}/orders`)
    return data
}

export const getOrderById = async (
    ordersId: string,
    storeId : string
    ) => {
        if (!ordersId) {
            const status = 400
            return status
        }
    const orders = await axios(`http://localhost:5000/api/${storeId}/orders/${ordersId}`)
    return orders.data
}

export const createOrder = async (
    order : NewOrder
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!order.name || !order.storeId || !order.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, order.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }

    const {status} = await axios.post(`http://localhost:5000/api/${order.storeId}/orders`,order)
    return status
}


export const updateOrder = async (
    updatedOrder : UpdatedOrder,

    ) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    if (!updatedOrder.OrderId || !updatedOrder.storeId || !updatedOrder.name || !updatedOrder.value) {
        const status = 400
        return status
    }

    const storeByUserId = await getStoreById(userId, updatedOrder.storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    
    const {status} = await axios.patch(`http://localhost:5000/api/${updatedOrder.storeId}/orders/${updatedOrder.OrderId}`,updatedOrder)
    return status
}

export const deleteOrder = async (
    ordersId: string | string[],
    storeId: string | string[]
    ) => {
        const { userId } = auth()
        if (!userId) {
            const status = 401
            return status
        }
        if (!ordersId) {
            const status = 400
            return status
        }

        
    const storeByUserId = await getStoreById(userId, storeId)

    if (!storeByUserId) {
        const status = 403
        return status
    }
    const {status} =  await axios.delete(`http://localhost:5000/api/${storeId}/orders/${ordersId}`)
    return status
}
