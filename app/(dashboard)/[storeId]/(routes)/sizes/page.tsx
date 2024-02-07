import { format } from 'date-fns'

import { SizeClient } from "./components/client"
import { getSizes } from '@/app/actions/sizes'
import { SizeColumn } from './components/columns'

interface SizeItem {
    _id : string,
    name : string,
    value : string,
    createdAt : string
}

const SizesPage = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const sizes = await getSizes(params.storeId)

    const formattedSizes : SizeColumn[] = sizes.map(({_id,name,value,createdAt} : SizeItem) => ({
        id : _id,
        name,
        value,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeClient data={formattedSizes} />
            </div>
            
        </div>
    )
}

export default SizesPage