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
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/components/ui/form'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { createCategory, deleteCategory, updateCategory } from '@/app/actions/categories'


type CategoryFormValues = z.infer<typeof formSchema>

interface Category {
    _id : string,
    storeId : string,
    billboardId : string,
    name : string,
    createdAt : string,
    updatedAt : string,
}

interface Billboard {
    _id : string,
    storeId : string,
    label : string,
    imageUrl : string,
    createdAt : string,
    updatedAt : string,
}

interface CategoryFormProps {
    initialData: Category | null,
    billboards : Billboard[]
}

const formSchema = z.object({
    name : z.string().min(1),
    billboardId : z.string().min(1),
})


export const CategoryForm : React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {

    const router = useRouter()
    const {categoryId, storeId} = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit category" : ""
    const description = initialData ? "Edit a category" : "Add a new category"
    const toastMessage = initialData ? "Category updated" : "Category created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
        name : '',
        billboardId : '',
    } })

    const onSubmit = async (data : CategoryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                const updatedcategory = {
                    categoryId,
                    storeId,
                    name : data.name,
                    billboardId : data.billboardId,
                    updatedAt : new Date()
                }
                await updateCategory(updatedcategory)
            } else {
                const newcategory = {
                    storeId,
                    name : data.name,
                    billboardId : data.billboardId,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }
                await createCategory(newcategory)
            }

            router.push(`/${storeId}/categories`)
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
            const {status,message} = await deleteCategory(categoryId,storeId)
            if (status === 200) {
                router.push(`/${storeId}/categories`)
                router.refresh()
                toast.success(`${message}`)
            } else {
                toast.error(`${message}`)
            }
        } catch (error) {
            toast.error("Make sure you removed all products using this categories first.")
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
                    <div className='grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lable</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='category label' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
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
                                                        placeholder="Select a billboard"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {billboards.map(({_id, label})=>(
                                                    <SelectItem key={_id} value={_id} >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
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