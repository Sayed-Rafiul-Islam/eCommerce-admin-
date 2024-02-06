import { getBillboardById } from "@/app/actions/billboards";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params
} : {
    params : { billboardId : string, storeId : string}
}) => {
    const billboard = await getBillboardById(params.billboardId, params.storeId)
    
    return ( 
        <div className="flex-col">
            <div  className="flex-1 p-8 pt-6 space-y-4">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
     );
}
 
export default BillboardPage;