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
import { DeleteStores, UpdateStores, getStores } from '@/app/actions/store'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiALert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'

interface Store {
    _id : string,
    name : string,
    userId : string,
    createdAt : string,
    updatedAt : string,
}

interface SettingFormProps {
    initialData: Store
}

const formSchema = z.object({
    name : z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingForm : React.FC<SettingFormProps> = ({
    initialData
}) => {

    const router = useRouter()
    const {storeId} = useParams()
    const origin = useOrigin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData
    })

    const onSubmit = async (data : SettingsFormValues) => {
        try {
            setLoading(true)
            await UpdateStores(storeId, data.name)
            router.push(`/${storeId}`)
            router.refresh()
            toast.success("Store Updated.")
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await DeleteStores(storeId)
            router.push('/')
            router.refresh()
            toast.success("Store deleted.")


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
                title="Settings"
                description="Manage store prefences"
                />
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash />
                </Button>
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
                                        <Input disabled={loading} placeholder='Store name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiALert 
            title='NEXT_PUBLIC_API_URL' 
            description={`${origin}/${storeId}`} 
            variant='public'
            />
        </>
    )
}