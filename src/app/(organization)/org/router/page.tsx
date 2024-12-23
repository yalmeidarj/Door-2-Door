import Provider from "@/components/Providers";
import OrgRouter from "../orgRouter";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (!session || !session.user) {
        redirect('/login')
    }
    return (
        <Provider session={session}>            
        <OrgRouter/>
        </Provider>
    )
}