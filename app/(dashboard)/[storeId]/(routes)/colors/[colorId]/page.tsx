import { ColorForm } from "./components/color-form";
import { getColorById } from "@/app/actions/colors";

const ColorPage = async ({
    params
} : {
    params : { colorId : string, storeId : string}
}) => {
    const color = await getColorById(params.colorId, params.storeId)
    
    return ( 
        <div className="flex-col">
            <div  className="flex-1 p-8 pt-6 space-y-4">
                <ColorForm initialData={color}/>
            </div>
        </div>
     );
}
 
export default ColorPage;