"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";


export default function SubmitFormButton({ title, className }: { title: string, className?: string }) {
    const { pending } = useFormStatus();
    return (
        <>
            <Button
                type="submit"
                disabled={pending}
                className={cn("",
                    // "text - sm border - solid border - 2 rounded - sm font - bold px - 4 focus:outline-none focus:shadow-outline",
                    // pending ? "bg-gray-400 border-gray-500 text-white" : "bg-white border-blue-600 text-blue-600",
                    // "hover:bg-blue-300 hover:border-blue-700 hover:text-gray-800",
                    className
                )}
            >
                {pending ? "Pending..." : title}
            </Button>



        </>
    );
}