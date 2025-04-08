"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";


export default function SubmitFormButton({ title, disabled, className }: { title: string, disabled?: boolean, className?: string }) {
    const { pending } = useFormStatus();
    return (
        <>
            <Button
                type="submit"
                disabled={pending || disabled} 
                className={cn("",
                    // "text - sm border - solid border - 2 rounded - sm font - bold px - 4 focus:outline-none focus:shadow-outline",
                    // pending ? "bg-gray-400 border-gray-500 text-white" : "bg-white border-blue-600 text-blue-600",
                    // "hover:bg-blue-300 hover:border-blue-700 hover:text-gray-800",
                    className, `${ disabled? 'bg-gray-400 cursor-not-allowed': '' }`
                )}
            >
                {pending ? "Pending..." : title}
            </Button>



        </>
    );
}