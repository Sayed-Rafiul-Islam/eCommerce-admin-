import axios from "axios"

interface Product {
    _id : string,
    name : string,
    isFeatured : boolean,
    isArchieved : boolean,
    price : number,
    createdAt : string,
    categoryId : { name : string  },
    sizeId : { name : string  },
    colorId : { value : string  }
}

export const getStockCount = async ( storeId : string ) => {
    const {data} = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products`)
    if (data.length > 0) {
        const notArchievedProducts = data.filter((product : Product) => product.isArchieved === false)
        return notArchievedProducts.length
    } else {
        return 0
    }
}