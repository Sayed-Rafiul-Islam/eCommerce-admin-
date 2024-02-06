"use client"

import { useParams } from "next/navigation"

import { useOrigin } from "@/hooks/use-origin"
import { ApiALert } from "@/components/ui/api-alert"

interface ApiListProps {
    entityName : string,
    entityIdName : string
}
export const ApiList : React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {
    const params = useParams()
    const origin = useOrigin()

    return (
        <>
            <ApiALert 
                title="GET" 
                variant="public" 
                description={`${origin}/${params.storeId}/${entityName}`}
            />
            <ApiALert 
                title="GET" 
                variant="public" 
                description={`${origin}/${params.storeId}/${entityName}/{${entityIdName}}`}
            />
            <ApiALert 
                title="POST" 
                variant="admin" 
                description={`${origin}/${params.storeId}/${entityName}`}
            />
            <ApiALert 
                title="PATCH" 
                variant="admin" 
                description={`${origin}/${params.storeId}/${entityName}/{${entityIdName}}`}
            />
            <ApiALert 
                title="DELETE" 
                variant="admin" 
                description={`${origin}/${params.storeId}/${entityName}/{${entityIdName}}`}
            />
        </>
    )
}