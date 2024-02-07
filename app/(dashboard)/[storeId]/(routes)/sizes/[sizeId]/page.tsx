import { getSizeById } from "@/app/actions/sizes";
import { SizeForm } from "./components/size-form";

const SizesPage = async ({
    params
} : {
    params : { sizeId : string, storeId : string}
}) => {
    const size = await getSizeById(params.sizeId, params.storeId)
    
    return ( 
        <div className="flex-col">
            <div  className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm initialData={size}/>
            </div>
        </div>
     );
}
 
export default SizesPage;