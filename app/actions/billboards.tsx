"use server"

import { auth } from "@clerk/nextjs"
import axios from "axios"

interface ImageUploadProps {
    label : string,
    imageUrl : string,
}


export const createBillboard = async (
    billboardId : string | string[],
    data : ImageUploadProps
) => {
    const { userId } = auth()
    if (!userId) {
        const status = 401
        return status
    }
    console.log([billboardId,userId,data])
    // if (!name) {
    //     const status = 400
    //     return status
    // }

    // const {data} = await axios.post(`http://localhost:5000/api/createBillboard?storeId=${billboardId}`,{userId})
    // return data
}

export const getBillboardById = async (
    billboardId: string
    ) => {
    const billboard = await axios(`http://localhost:5000/api/getBillboardbyId?billboardId=${billboardId}`)
    return billboard.data
}


export const getFirstStore = async (
    userId: string,
    ) => {
    const {data} =  await axios(`http://localhost:5000/api/getFirstStore?userId=${userId}`)
    return data[0]
}

export const getStores = async () => {
    const {userId} =auth()
    const {data} =  await axios(`http://localhost:5000/api/getStores?userId=${userId}`)
    return data
}

export const updateBillboard = async (
    billboardId : string | string[],
    data : ImageUploadProps,

    ) => {
        const { userId } = auth()
        console.log([billboardId,userId,data])
    // if (!userId) {
    //     const status = 401
    //     return status
    // }
    // if (!billboardId) {
    //     const status = 400
    //     return status
    // }
    // if (!billboardId) {
    //     const status = 400
    //     return status
    // }
    
    // const {status} = await axios.patch(`http://localhost:5000/api/updateBillboard`,{userId,billboardId,name})
    // return status
}

export const DeleteStores = async (
    storeId: string | string[],
    ) => {
    const { userId } = auth()
    const {data} =  await axios.delete(`http://localhost:5000/api/deleteStore?storeId=${storeId}&userId=${userId}`)
    return data
}
