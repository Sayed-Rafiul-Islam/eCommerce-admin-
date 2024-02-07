import { format } from 'date-fns'


import { CategoryClient } from "./components/client"
import { CategoryColumn } from "./components/columns"
import { getCategories } from '@/app/actions/categories'

interface CategoryItem {
    _id : string,
    name : string,
    billboardId : string,
    createdAt : string
}

const CategoriesPage = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const categories = await getCategories(params.storeId)

    const formattedCategories : CategoryColumn[] = categories.map(({_id,name,billboardId,createdAt} : CategoryItem) => ({
        id : _id,
        name,
        billboardId,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryClient data={formattedCategories} />
            </div>
            
        </div>
    )
}

export default CategoriesPage