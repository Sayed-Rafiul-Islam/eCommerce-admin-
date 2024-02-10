import { format } from 'date-fns'

import { formatter } from '@/lib/utils'
import { getProducts } from '@/app/actions/products'
import { ProductColumn } from './components/columns'
import { ProductClient } from './components/client'


interface ProductItem {
    _id : string,
    name : string,
    isFeatured : boolean,
    isArchieved : boolean,
    quantity : number,
    price : number,
    createdAt : string,
    categoryId : { name : string  },
    sizeId : { name : string  },
    colorId : { value : string  }
}

const ProductsPage = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const products = await getProducts(params.storeId)

    const formattedProducts : ProductColumn[] = products.map((
        {
            _id,
            name,
            isFeatured,
            isArchieved,
            quantity,
            price,
            categoryId,
            sizeId,
            colorId,
            createdAt
        } : ProductItem) => ({
        id : _id,
        name,
        isFeatured,
        isArchieved : isArchieved,
        price : formatter.format(price),
        quantity,
        category : categoryId.name,
        size : sizeId.name,
        color : colorId.value,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient data={formattedProducts} />
            </div>
            
        </div>
    )
}

export default ProductsPage