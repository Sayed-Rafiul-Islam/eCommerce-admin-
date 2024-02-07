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
import { createColor, deleteColor, updateColor } from '@/app/actions/colors'


type SettingsFormValues = z.infer<typeof formSchema>

interface Color {
    _id : string,
    storeId : string,
    name : string,
    value : string,
    createdAt : string,
    updatedAt : string,
}

interface ColorFormProps {
    initialData: Color | null
}

const formSchema = z.object({
    name : z.string().min(1),
    value : z.string().min(1),
})


export const ColorForm : React.FC<ColorFormProps> = ({
    initialData
}) => {

    const router = useRouter()
    const {colorId, storeId} = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit color" : ""
    const description = initialData ? "Edit a color" : "Add a new color"
    const toastMessage = initialData ? "Color updated" : "Color created"
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
                const updatedcolor = {
                    colorId,
                    storeId,
                    name : data.name,
                    value : data.value,
                    updatedAt : new Date()
                }
                await updateColor(updatedcolor)
            } else {
                const newcolor = {
                    storeId,
                    name : data.name,
                    value : data.value,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }
                await createColor(newcolor)
            }

            router.push(`/${storeId}/colors`)
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
            await deleteColor(colorId,storeId)
            router.push(`/${storeId}/colors`)
            router.refresh()
            toast.success("color deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.")
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
                        color="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash />
                    </Button>
                }
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='color name' {...field} />
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
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='color value' {...field} />
                                            <div 
                                                className='p-4 rounded-full border'
                                                style={{ backgroundColor : field.value}}
                                                />
                                        </div>
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