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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import { createBillboard, deleteBillboard, updateBillboard } from '@/app/actions/billboards'


type SettingsFormValues = z.infer<typeof formSchema>

interface Billboard {
    _id : string,
    storeId : string,
    label : string,
    imgageUrl : string,
    createdAt : string,
    updatedAt : string,
}

interface BillboardFormProps {
    initialData: Billboard | null
}

const formSchema = z.object({
    label : z.string().min(1),
    imageUrl : z.string().min(1),
})


export const BillboardForm : React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const router = useRouter()
    const {billboardId, storeId} = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit billboard" : ""
    const description = initialData ? "Edit a billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<SettingsFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
        label : '',
        imageUrl : "",
    } })

    const onSubmit = async (data : SettingsFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                const updatedBillboard = {
                    billboardId,
                    storeId,
                    label : data.label,
                    imageUrl : data.imageUrl,
                    updatedAt : new Date()
                }
                await updateBillboard(updatedBillboard)
            } else {
                const newBillboard = {
                    storeId,
                    label : data.label,
                    imageUrl : data.imageUrl,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }
                await createBillboard(newBillboard)
            }

            router.push(`/${storeId}/billboards`)
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
            await deleteBillboard(billboardId,storeId)
            router.push(`/${storeId}/billboards`)
            router.refresh()
            toast.success("Billboard deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products and categories first.")
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
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background image</FormLabel>
                                    <FormControl>
                                        <ImageUpload  
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url)=>field.onChange(url)}
                                            onRemove={()=>field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lable</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Billboard label' {...field} />
                                    </FormControl>
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