"use client"

import * as z from 'zod'
import { Trash } from "lucide-react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import { createProduct, deleteProduct, updateProduct } from '@/app/actions/products'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'


type SettingsFormValues = z.infer<typeof formSchema>

interface Product {
    _id : string,
    name : string,
    price : number,
    quantity : number,
    images : { url : string}[],
    storeId : string | string [],
    categoryId : string,
    sizeId : string,
    colorId : string,
    isFeatured : boolean,
    isArchieved : boolean,
    createdAt : Date,
    updatedAt : Date,
}

interface Image {

}

interface Category {
    _id : string,
    storeId : string,
    billboardId : string,
    name : string,
    createdAt : string,
    updatedAt : string,
}

interface Color {
    _id : string,
    storeId : string,
    name : string,
    value : string,
    createdAt : string,
    updatedAt : string,
}

interface Size {
    _id : string,
    storeId : string,
    name : string,
    value : string,
    createdAt : string,
    updatedAt : string,
}

interface ProductFormProps {
    initialData: Product & {
        images : Image
    } | null,
    categories : Category[],
    sizes : Size[],
    colors : Color[]
}

const formSchema = z.object({
    name : z.string().min(1),
    price : z.coerce.number().min(1),
    quantity : z.coerce.number().min(1),
    images : z.object({ url : z.string() }).array(),
    categoryId : z.string().min(1),
    sizeId : z.string().min(1),
    colorId : z.string().min(1),
    isFeatured : z.boolean().default(false).optional(),
    isArchieved : z.boolean().default(false).optional(),
})


export const ProductForm : React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors
}) => {

    const router = useRouter()
    const {productId, storeId} = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit product" : ""
    const description = initialData ? "Edit a product" : "Add a new product"
    const toastMessage = initialData ? "Product updated" : "Product created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<SettingsFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData ? {
            ...initialData,
            price : parseFloat(String(initialData?.price)),
        } : {
        name : '',
        price : 0,
        images : [],
        categoryId : '',
        sizeId : '',
        colorId : '',
        isFeatured : false,
        isArchieved : false
    } })

    const onSubmit = async (data : SettingsFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                const updatedproduct = {
                    productId,
                    name : data.name,
                    price : data.price,
                    quantity : data.quantity,
                    images : data.images,
                    categoryId : data.categoryId,
                    storeId,
                    sizeId : data.sizeId,
                    colorId : data.colorId,
                    isFeatured : data.isFeatured,
                    isArchieved : data.isArchieved,
                    updatedAt : new Date()
                }
                await updateProduct(updatedproduct)
            } else {
                const newproduct = {
                    storeId,
                    name : data.name,
                    price : data.price,
                    quantity : data.quantity,
                    images : data.images,
                    categoryId : data.categoryId,
                    sizeId : data.sizeId,
                    colorId : data.colorId,
                    isFeatured : data.isFeatured,
                    isArchieved : data.isArchieved,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }
                await createProduct(newproduct)
            }

            router.push(`/${storeId}/products`)
            router.refresh()
            toast.success(`${toastMessage}`)
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await deleteProduct(productId,storeId)
            router.push(`/${storeId}/products`)
            router.refresh()
            toast.success("product deleted.")
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                title={title}
                description={description}
                />
                {
                    initialData &&
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash />
                    </Button>
                }
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload  
                                            buttonName='Upload Images'
                                            value={field.value.map((image)=> image.url )}
                                            disabled={loading}
                                            onChange={(url)=>field.onChange([...field.value, { url }])}
                                            onRemove={(url)=>field.onChange([...field.value.filter((current)=> current.url !== url)])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className='grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='product name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type='number' disabled={loading} placeholder='9.99' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type='number' disabled={loading} placeholder='48' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categories</FormLabel>
                                        <Select 
                                            disabled={loading} 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue 
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(({_id, name})=>(
                                                    <SelectItem key={_id} value={_id} >
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sizes</FormLabel>
                                        <Select 
                                            disabled={loading} 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue 
                                                        defaultValue={field.value}
                                                        placeholder="Select size"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sizes.map(({_id, name})=>(
                                                    <SelectItem key={_id} value={_id} >
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colors</FormLabel>
                                        <Select 
                                            disabled={loading} 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue 
                                                        defaultValue={field.value}
                                                        placeholder="Select a Color"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {colors.map(({_id, name})=>(
                                                    <SelectItem key={_id} value={_id} >
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className='flex flex-row rounded-md border p-4 items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchieved"
                            render={({ field }) => (
                                <FormItem className='flex flex-row rounded-md border p-4 items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archieved
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}