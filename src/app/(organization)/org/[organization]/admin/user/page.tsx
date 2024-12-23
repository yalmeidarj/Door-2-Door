import AdminNavigation from "@/components/AdminNavigation ";
import PageHeader from "@/components/PageHeader";
import CurrentShifts from "./currentShifts";
import AccordionItems from "../admin-ui/adminOptions";
import PastShifts from "./pastShifts";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import UserManager from "./userManager";
import NewUserRequests from "./newUser";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined, org: string | undefined }
}) {

    const session = await auth()

    if (!session?.user) return null
    
    const routeLinks = [
        {
            name: "User Management",
        },
    ]

    const adminOptions = [
        {
            id: 1,
            name: "View Agents in field",
            component: <CurrentShifts  />
        },
        {
            id: 2,
            name: "View Past Shifts",
            component: <PastShifts />
            
        },
        {
            id: 3,
            name: "Manage Users",
            component: <UserManager  />
        },
        {
            id: 4,
            name: "Invite New User",
            component: <NewUserRequests  />
        },
    ] 

    return (
        <div className="w-full ">
            <PageHeader
                routes={routeLinks}
            />
            <div className="container   ">
                <AdminNavigation>
                    <AccordionItems
                        data={adminOptions}
                    />
                </AdminNavigation>
            </div>
        </div>
    );
}
