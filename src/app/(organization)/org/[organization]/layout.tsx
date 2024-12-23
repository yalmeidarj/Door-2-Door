import { auth } from "@/auth";
import Provider from "@/components/Providers";
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/navbar/app-siderbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Authorized from "../isAuthorized";

type Params = Promise<{ organization: string }>

export async function generateMetadata({ params }: { params: Params }) {
    const { organization } = await params
    return {
        title: `Sites - ${organization.toUpperCase()}`,
    }
}

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Params
}) {

    const { organization } = await params
    const orgName = organization.replace("%20", " ").replace("-", " ")
        // .replace(/\b\w/g, char => char.toUpperCase());

    const session = await auth();
    if (!session || !session.user) {
        redirect('/login')
    }
    const userId = session.user.id as string;

    const secret = process.env.CONVEX_AUTH_ADAPTER_SECRET!;
    return (
        <div className="w-full">
            <SidebarProvider>
                <Provider session={session}>
                    <Authorized
                        id={userId}
                        secret={secret}
                        orgName={orgName}
                    >
                        <AppSidebar
                            orgName={orgName}
                        />            
                        <main className=" w-full">
                            {children}
                        </main>
                    </Authorized>
                </Provider>
            </SidebarProvider>
        </div>
    )
}

