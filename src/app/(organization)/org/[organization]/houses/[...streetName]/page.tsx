import { auth } from "@/auth"
import ClientPageHeader from "@/components/ClientPageHeader"
import HousesFeed from "@/components/HouseFeed"

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
    const searchParams = await props.searchParams
    const streetId = searchParams.street as string

    const session = await auth();
    if (!session || !session.user) {
        console.log("no session")
        return null
    }
    const userId = session.user.id as string;
    const headerData = {
        streetId: streetId,
        userId: userId
    }
    return (
        <>
            <ClientPageHeader
                data={headerData}
            />                
            <div className="flex flex-col items-center p-4 text-black md:min-h-[95vh]">                
                <HousesFeed
                    streetId={streetId}
                    userId={userId}
                    />
            </div>
        </>
    );
}