import { format } from 'date-fns'


import { ColorColumn } from './components/columns'
import { getColors } from '@/app/actions/colors'
import { ColorClient } from './components/client'

interface SizeItem {
    _id : string,
    name : string,
    value : string,
    createdAt : string
}

const ColorsPage = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const colors = await getColors(params.storeId)

    const formattedColors : ColorColumn[] = colors.map(({_id,name,value,createdAt} : SizeItem) => ({
        id : _id,
        name,
        value,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorClient data={formattedColors} />
            </div>
            
        </div>
    )
}

export default ColorsPage