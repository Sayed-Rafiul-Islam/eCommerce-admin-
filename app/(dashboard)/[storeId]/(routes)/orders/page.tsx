import { format } from 'date-fns'

import { formatter } from '@/lib/utils'

import { OrderClient } from "./components/client"
import { OrderColumn } from "./components/columns"
import { getOrders } from '@/app/actions/orders'



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

const OrdersPage = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const orders = await getOrders(params.storeId)

    const formattedorders : OrderColumn[] = orders.map(({_id,orderedItems,isPaid,phone,address,createdAt} : Order) => ({
        // const test = orderedItems.map((orderedItem) => orderedItem.orderedItem.name).join(", ")
        id : _id,
        phone,
        address,
        products : orderedItems.map((orderedItem) => orderedItem.orderedItem.name).join(', '),
        totalPrice : formatter.format(orderedItems.reduce((total, {orderedItem}) => {
            return total + Number(orderedItem.price)
        },0)),
        isPaid,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <OrderClient data={formattedorders} />
            </div>
            
        </div>
    )
}

export default OrdersPage