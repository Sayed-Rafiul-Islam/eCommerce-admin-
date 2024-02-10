"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SizeColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { deleteBillboard } from "@/app/actions/billboards"
import { AlertModal } from "@/components/modals/alert-modal"
import { deleteSize } from "@/app/actions/sizes"

interface CellActionProps {
    data : SizeColumn
}

export const CellAction : React.FC<CellActionProps> = ({data}) => {

    const router = useRouter()
    const {storeId} = useParams()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onCopy = (id : string) => {
        navigator.clipboard.writeText(id)
        toast.success("Size id copied to the clipboard")
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            const {status, message} = await deleteSize(data.id,storeId)
            if ( status === 200) {
                router.refresh()
                toast.success(`${message}`)
            } else {
                toast.error(`${message}`)
            }
                

        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }


    return (
        <>
            <AlertModal 
            isOpen={open} 
            onClose={()=>setOpen(false)} 
            onConfirm={onDelete} 
            loading={loading} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>router.push(`/${storeId}/sizes/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(true)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}