// This pages displays a list of sites for a given organization
import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import SiteFeed from "@/components/SiteFeed";
import type { Metadata, ResolvingMetadata } from 'next'

type Params = Promise<{ organizationId: string }>
type SearchParams = Promise<{ [id: string]: string | string[] | undefined }>

// export async function generateMetadata(props: {
//     params: Params
//     searchParams: SearchParams
// }) {
//     const params = await props.params
//     const searchParams = await props.searchParams
//     const slug = (await props.params).organizationId
//     const query = searchParams.query
//     return {
//         title: `Sites for ${slug}`,
//     }
// }


export default async function Page(props: {
    params: Params
    searchParams: SearchParams
}) {

        
    // const params = await props.params
    // const searchParams = await props.searchParams
    // const slug = params.organizationId
    // const query = searchParams.query    
    // const orgId = query?.id
   
    const routeLinks = [
        {
            name: "Organization",
            link: "/org"
            // link: `/org/site?id=${searchParams.id}`            
        },
        {
            name: "Sites",
        },
    ]
    return (
        <div className="flex flex-col items-center">
            <PageHeader
                routes={routeLinks}
            />
            <SiteFeed />
    
        </div>
    );
}
