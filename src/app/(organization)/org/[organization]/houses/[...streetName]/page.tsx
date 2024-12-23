import { auth } from "@/auth"
import ClientPageHeader from "@/app/(organization)/org/[organization]/streets/[...siteName]/ClientPageHeader"
import HousesFeed from "@/components/HouseFeed"
import PageHeader from "@/components/PageHeader"


type Params = Promise<{ streetName: string, organization: string }>
type SearchParams = Promise<{ [street: string]: string | string[] | undefined, site: string }>

export async function generateMetadata(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.streetName
    const orgName = params.organization
    const query = searchParams.query
}


export default async function Page(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const streetName = params.streetName
    const orgName = params.organization

    const query = searchParams.query

    const session = await auth();
    if (!session || !session.user) {
        console.log("no session")
        return null
    }
    const routeLinks = (orgName: string) => ([
        {
            name: "Streets",
            link: `/org/${orgName}/streets/back/?site=${searchParams.site}`
        },
        {
            name: `${streetName.toString().replace(/%20/g, ' ') }`,
        },
    ]
    )

    const routes = routeLinks(orgName);
    return (
        <>
            {/* <ClientPageHeader
                data={{ id: searchParams.street as string, type: "streetId" }}
            > */}
                
            <PageHeader
                routes={routes}
            />

            <div className="flex flex-col items-center p-4 text-black">                
                <HousesFeed
                    streetId={searchParams.street as string}
                    userId={session.user.id as string}
                    />
            </div>
                    {/* </ClientPageHeader> */}
        </>
    );
}