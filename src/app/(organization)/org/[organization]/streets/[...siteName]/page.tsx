import PageHeader from "@/components/PageHeader";
import StreetFeed from "@/components/StreetFeed";

type Params = Promise<{ siteName: string, organization:string }>
type SearchParams = Promise<{ [site: string]: string | string[] | undefined, org: string | undefined }>

export async function generateMetadata(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.siteName
    const orgName = params.organization
    const query = searchParams.query
}


export default async function Page(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.siteName
    const orgName = params.organization
    
    const query = searchParams.query
    const routeLinks = (orgName: string) => ([
        {
            name: "Sites",
            link: `/org/${orgName}`
        },
        {
            name: slug.toString().replace(/%20/g, ' ')
        },
    ]
    )

    const routes = routeLinks(orgName);
    return (
        <div className="w-full ">
            <div className="w-full flex flex-col items-center ">
                <PageHeader
                    routes={routes}
                />
                {orgName}
                
                <StreetFeed
                    
                    id={searchParams.site as string}
                    // orgId={searchParams.org as string}
                // start={0}
                // perPage={20}      
                />
            </div>
        </div>
    );
}