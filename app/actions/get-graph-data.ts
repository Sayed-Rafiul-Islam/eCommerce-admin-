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

interface GraphData {
    name : string,
    total : number
}

export const getGraphData = async ( storeId : string ) => {
    const {data} = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/orders`)
    const paidOrders = data.filter((order : Order) => order.isPaid === true)
    const monthlyRevenue : { [key : number] : number } = {}

    for (const order of paidOrders) {
        const createdAt = order.createdAt.split("T")[0]
        const month = createdAt.split("-")[1]

     


        let revenueForOrder : number = 0

        for (const item of order.orderedItems) {
            revenueForOrder = revenueForOrder + parseFloat(item.orderedItem.price)  
        }
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder

    }






    const graphData : GraphData[] = [
        { name : "Jan", total : 0 },
        { name : "Feb", total : 0 },
        { name : "Mar", total : 0 },
        { name : "Apr", total : 0 },
        { name : "May", total : 0 },
        { name : "Jun", total : 0 },
        { name : "Jul", total : 0 },
        { name : "Aug", total : 0 },
        { name : "Sep", total : 0 },
        { name : "Oct", total : 0 },
        { name : "Nov", total : 0 },
        { name : "Dec", total : 0 },
    ] 

    const months = Object.keys(monthlyRevenue)
    const revenues = Object.values(monthlyRevenue)
    for ( let i = 0; i < months.length; i++ ) {
        graphData[parseInt(months[i])-1].total = revenues[i]
    }

    return graphData

}