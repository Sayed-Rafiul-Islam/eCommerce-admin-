"use cilent"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash } from "lucide-react";


import { Button } from "@/components/ui/button"

interface ImageUploadProps {
    buttonName:string,
    disabled?: boolean,
    onChange : (value: string) => void,
    onRemove : (value: string) => void,
    value : string[]

}

const ImageUpload : React.FC<ImageUploadProps> = ({
    buttonName,
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [mounted, setMounted] = useState(false)

    useEffect(()=>{
        setMounted(true)
    },[])


    const onUpload = (result : any ) => {
        onChange(result.info.secure_url)
    }

    if (!mounted) {
        return null
    }


  return (
    <div>
        <div className="mb-4 gap-4 flex items-center">
            {value.map((url)=>(
                <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button type="button" onClick={()=>onRemove(url)} variant='destructive' size='icon'>
                            <Trash />
                        </Button>
                    </div>
                    <Image 
                        fill
                        className="object-cover"
                        alt="Image"
                        src={url}
                    />
                </div>
            ))}
        </div>
        <CldUploadWidget onUpload={onUpload} uploadPreset="nwdnbs6x">
                {({ open }) =>{
                    const onClick = () => {
                        open()
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            {buttonName}
                        </Button>
                    )
                }}
        </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
