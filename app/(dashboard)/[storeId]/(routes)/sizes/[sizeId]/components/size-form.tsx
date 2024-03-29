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
import { createSize, deleteSize, updateSize } from '@/app/actions/sizes'


type SettingsFormValues = z.infer<typeof formSchema>

interface Size {
    _id : string,
    storeId : string,
    name : string,
    value : string,
    createdAt : string,
    updatedAt : string,
}

interface SizeFormProps {
    initialData: Size | null
}

const formSchema = z.object({
    name : z.string().min(1),
    value : z.string().min(1),
})


export const SizeForm : React.FC<SizeFormProps> = ({
    initialData
}) => {

    const router = useRouter()
    const {sizeId, storeId} = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit size" : ""
    const description = initialData ? "Edit a size" : "Add a new size"
    const toastMessage = initialData ? "Size updated" : "Size created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<SettingsFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
        name : '',
        value : "",
    } })

    const onSubmit = async (data : SettingsFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                const updatedsize = {
                    sizeId,
                    storeId,
                    name : data.name,
                    value : data.value,
                    updatedAt : new Date()
                }
                await updateSize(updatedsize)
            } else {
                const newsize = {
                    storeId,
                    name : data.name,
                    value : data.value,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }
                await createSize(newsize)
            }

            router.push(`/${storeId}/sizes`)
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
            setLoading(true)
            const {status, message} = await deleteSize(sizeId,storeId)
            if ( status === 200) {
                router.push(`/${storeId}/sizes`)
                router.refresh()
                toast.success(`${message}`)
            } else {
                toast.error(`${message}`)
            }
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
                    <div className='grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='size name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='size value' {...field} />
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