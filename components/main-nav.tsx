"use client"

import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import Link from "next/link"

export function MainNav({
    className,
    ...props
} : React.HtmlHTMLAttributes<HTMLElement>) {

    const pathname = usePathname()
    const params = useParams()

    const routes = [
        {
            href : `/${params.storeId}`,
            label : "Overview",
            active : pathname === `/${params.storeId}`
        },
        {
            href : `/${params.storeId}/billboards`,
            label : "Billboards",
            active : pathname === `/${params.storeId}/billboards` ||
                     pathname === `/${params.storeId}/billboards/new` ||
                     pathname === `/${params.storeId}/billboards/${params.billboardId}`
        },
        {
            href : `/${params.storeId}/categories`,
            label : "Categories",
            active : pathname === `/${params.storeId}/categories` ||
            pathname === `/${params.storeId}/categories/new` ||
            pathname === `/${params.storeId}/categories/${params.categoryId}`
        },
        {
            href : `/${params.storeId}/sizes`,
            label : "Sizes",
            active : pathname === `/${params.storeId}/sizes` ||
            pathname === `/${params.storeId}/sizes/new` ||
            pathname === `/${params.storeId}/sizes/${params.sizeId}`
        },
        {
            href : `/${params.storeId}/colors`,
            label : "Colors",
            active : pathname === `/${params.storeId}/colors` ||
            pathname === `/${params.storeId}/colors/new` ||
            pathname === `/${params.storeId}/colors/${params.sizeId}`
        },
        {
            href : `/${params.storeId}/products`,
            label : "Products",
            active : pathname === `/${params.storeId}/products` ||
            pathname === `/${params.storeId}/products/new` ||
            pathname === `/${params.storeId}/products/${params.sizeId}`
        },
        {
            href : `/${params.storeId}/settings`,
            label : "Settings",
            active : pathname === `/${params.storeId}/settings`
        },
    ]
  return (
    <nav 
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
        {
            routes.map((route)=>(
                <Link 
                    key={route.href} 
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))
        }
    </nav>
  )
}
