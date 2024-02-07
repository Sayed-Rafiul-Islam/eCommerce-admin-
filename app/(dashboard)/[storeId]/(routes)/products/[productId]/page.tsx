import { getCategories } from "@/app/actions/categories";
import { ProductForm } from "./components/product-form";
import { getProductById } from "@/app/actions/products";
import { getSizes } from "@/app/actions/sizes";
import { getColors } from "@/app/actions/colors";

const ProductPage = async ({
    params
} : {
    params : { productId : string, storeId : string}
}) => {
    const product = await getProductById(params.productId, params.storeId)
    const categories = await getCategories(params.storeId)
    const sizes = await getSizes(params.storeId)
    const colors = await getColors(params.storeId)
    
    return ( 
        <div className="flex-col">
            <div  className="flex-1 p-8 pt-6 space-y-4">
                <ProductForm 
                    categories={categories} 
                    sizes={sizes}
                    colors={colors}
                    initialData={product}
                />
            </div>
        </div>
     );
}
 
export default ProductPage;