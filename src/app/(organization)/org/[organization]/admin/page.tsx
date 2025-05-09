import AdminNavigation from "@/components/AdminNavigation ";
import PageHeader from "@/components/PageHeader";
import AccordionItems from "./admin-ui/adminOptions";
import PermissionProvider from "./permissionsProvider";
import { auth } from "@/auth";
import DataProcessor from "@/components/DataProcessor";
import AddressGeocoder from "@/components/AddressGeocoder";
import InfoFeed from "@/components/info-feed/infoFeed";
import AddSingleHouse from "@/components/AddSingleHouse";
import DeleteSingleHouse from "@/components/DeleteSingleHouse";

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

        {
            name: "Site Management",
        },
    ]

    const adminOptions = [
        {
            id: 1,
            name: "Create New Site",            
            component: <DataProcessor />
        },
        {
            id: 2,
            name: "Update a Site  (FETCHING)",            
            component: <DataProcessor
                userId={user.id as string}
                update />
        },
        {
            id: 3,
            name: "Add a single house to a site",            
            component: <AddSingleHouse/>
        },
        {
            id: 4,
            name: "Delete a single house from a site",            
            component: <DeleteSingleHouse />
        },
        {
            id: 5,
            name: "Get lat/long from address",
            component: <AddressGeocoder  />
        },
        {
            id: 6,
            name: "View Site Info",
            component: <InfoFeed  />
        },
    ] 

    const secret = process.env.CONVEX_AUTH_ADAPTER_SECRET!;
    return (
        <div className="w-full min-h-[95vh]">
            <PageHeader
                routes={routeLinks}
            />
            <div className="container  "> 
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

