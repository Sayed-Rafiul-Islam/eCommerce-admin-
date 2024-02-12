import axios from "axios"

interface Item {
    orderedItem : {
        productId : string,
        name : string,
        price : number,
    },
    quantity : Number
}

interface Order {
    _id : string,
    storeId : string,
    orderedItems : Item[],
    isPaid : boolean,
    phone : string,
    address : string,
    createdAt : string
}

export const getTotalRevenue = async ( storeId : string ) => {
    const {data} = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/orders`)
    if (data.length > 0) {
        const paidOrders = data.filter((order : Order) => order.isPaid === true)
        const totalRevenue = paidOrders.reduce((total : any, order : any) => {
            const orderTotal = order.orderedItems.reduce((orderSum : any,{orderedItem,quantity} : any) => {
                return orderSum = parseFloat(orderedItem?.price) * quantity
            },0)
            return total + orderTotal
        },0)
        return totalRevenue
    } else {
        return 0
    }
}