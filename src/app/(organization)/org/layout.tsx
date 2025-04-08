import { auth } from "@/auth";
import Authorized from "./isAuthorized";
import Provider from "@/components/Providers";
import { redirect } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navbar/app-siderbar"
import { OrganizationProvider } from "@/components/contexts/OrganizationContext";
import { use } from 'react'
import { Toaster } from "sonner";

type Params = Promise<{ organizationId: string }>

export async function generateMetadata({ params }: { params: Params }) {
    // const { organizationId } = params
    return {
        title: `Organization`,
    }
}

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Params
}) {    

    const session = await auth();
    if (!session || !session.user) {
        redirect('/login')    
    }

    const userId = session.user.id as string;    
    const secret = process.env.CONVEX_AUTH_ADAPTER_SECRET!;
    
    return (
        <div className="w-full">
            <main className=" w-full">            
                {children}
            </main>
            <Toaster richColors position="bottom-left" />
        </div>
    )
}

