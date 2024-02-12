"use client"

import { Copy, Server } from "lucide-react"
import toast from "react-hot-toast"


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


interface ApiALertProps {
    title : string,
    description : string,
    variant : "public" | "admin"
}

const textMap : Record<ApiALertProps["variant"], string> = {
    public : "Public",
    admin : "Admin"
}

const variantMap : Record<ApiALertProps["variant"], BadgeProps["variant"]> = {
    public : "secondary",
    admin : "destructive"
}

export const ApiALert : React.FC<ApiALertProps> = ({
    title,
    description,
    variant = "public"
}) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description)
        toast.success("Api route copied to the clipboard")
    }
    return(
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between overflow-x-scroll">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm mr-10">
                        {description}
                    </code>
                    <Button variant='outline' size='sm' onClick={onCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </AlertDescription>
        </Alert>
    )
}