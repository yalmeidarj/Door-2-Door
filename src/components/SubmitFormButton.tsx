"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";


export default function SubmitFormButton({ title, className }: { title: string, className?: string }) {
    const { pending } = useFormStatus();
    return (
        <>
            <button
                type="submit"
                disabled={pending}
                className={cn("text-sm  hover:bg-black text-black border-l-solid border-l-2 border-b-black hover:text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline", pending ? "bg-gray-400" : "bg-white",
                    className
                )}
            >
                {pending ? "Pending..." : title }
                
            </button>

        </>
    );
}