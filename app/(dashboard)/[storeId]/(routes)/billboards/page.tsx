import { format } from 'date-fns'

import { getBillboards } from "@/app/actions/billboards"
import { BillboardClient } from "./components/client"
import { BillboardColumn } from "./components/columns"

interface BillboardItem {
    _id : string,
    label : string,
    createdAt : string
}

const Billboards = async ({
    params
} : {
    params : { storeId : string}
}) => {

    const billboards = await getBillboards(params.storeId)

    const formattedBillboards : BillboardColumn[] = billboards.map(({_id,label,createdAt} : BillboardItem) => ({
        id : _id,
        label,
        createdAt : format(createdAt,"MMMM do, yyyy")
    }))


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardClient data={formattedBillboards} />
            </div>
            
        </div>
    )
}

export default Billboards