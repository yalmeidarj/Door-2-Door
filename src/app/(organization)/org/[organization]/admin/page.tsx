
import AdminNavigation from "@/components/AdminNavigation ";
import DocumentUploader from "@/components/dashboard-management/DashboardManagement";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Button } from "react-day-picker";
import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import { FaUserAlt, FaSalesforce } from "react-icons/fa";
import AccordionItems from "./admin-ui/adminOptions";
import PermissionProvider from "./permissionsProvider";
import { auth } from "@/auth";


type Params = Promise<{ organization: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.organization
    const query = searchParams.query

    return {
        title: `${slug}'s Management`,
    }
}
export default async function Page(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.organization
    const orgName = slug.replace("%20", " ").replace("-", " ");
    const query = searchParams.query
    const session = await auth();
    if (!session || !session.user) {
        console.log("no session")
        return null
    }
    const user = session.user
    
    const routeLinks = [
        // {
        //     name: "Sites",
        //     link: `/org/site?id=${searchParams.id as string}`
        // },
        {
            name: "Site Management",
        },
    ]

    const adminOptions = [
        {
            id: 1,
            name: "Create New Site",
            component: <DocumentUploader orgName={orgName} />
        },
        {
            id: 2,
            name: "Update Current Site",
            component: <div>Update Current Site</div>
        },
        {
            id: 3,
            name: "Switch Site Status (active/inactive)",
            component: <div>Switch Site Status (active/inactive)</div>
        },
        {
            id: 4,
            name: "Delete Site",
            component: <div>Delete Site</div>
        }
    ] 

    const secret = process.env.CONVEX_AUTH_ADAPTER_SECRET!;
    return (
        <div className="w-full   ">
            <PageHeader
                routes={routeLinks}
            />
            <div className="container   "> 
                <PermissionProvider
                    id={user.id as string}
                    secret={secret}
                >                    
                <AdminNavigation>
                    <AccordionItems
                        data={adminOptions}
                        />
                </AdminNavigation>
                        </PermissionProvider>
            </div>
        </div>
    );
}

