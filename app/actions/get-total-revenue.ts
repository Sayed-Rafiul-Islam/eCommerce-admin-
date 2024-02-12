import axios from "axios"

interface Item {
    orderedItem : {
        _id : string,
        name : string,
        isFeatured : boolean,
        isArchieved : boolean,
        price : number,
        createdAt : string,
        categoryId : { name : string  },
        sizeId : { name : string  },
        colorId : { value : string  }
    },
    _id : string
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
    console.log(data)
    if (data.length > 0) {
        const paidOrders = data.filter((order : Order) => order.isPaid === true)
        const totalRevenue = paidOrders.reduce((total : any, order : any) => {
            const orderTotal = order.orderedItems.reduce((orderSum : any,{orderedItem} : any) => {
                return orderSum = parseFloat(orderedItem?.price)
            },0)
            return total + orderTotal
        },0)
        return totalRevenue
    } else {
        return 0
    }
}