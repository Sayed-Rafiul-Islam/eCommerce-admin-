import { getBillboards } from "@/app/actions/billboards";
import { CategoryForm } from "./components/category-form";
import { getCategoryById } from "@/app/actions/categories";

const CategoryPage = async ({
    params
} : {
    params : { categoryId : string, storeId : string}
}) => {
    const category = await getCategoryById(params.categoryId, params.storeId)
    const billboards = await getBillboards(params.storeId)
    
    return ( 
        <div className="flex-col">
            <div  className="flex-1 p-8 pt-6 space-y-4">
                <CategoryForm billboards={billboards} initialData={category}/>
            </div>
        </div>
     );
}
 
export default CategoryPage;