import { defaultValues } from "@/lib/utils"
import GoBack from "@/components/GoBack"
import StreetFeed from "@/components/StreetFeed"

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined }
    }) {    
    
    const {defaultPage, defaultPerPage} = defaultValues
    const page = Number(searchParams['page']) ?? defaultPage
    const perPage = Number(searchParams['per_page']) ?? defaultPerPage
    const start = (Number(page) - 1) * Number(perPage)
    const streetId = searchParams['id'] as string

    return (
        <main className="flex flex-col items-center ">
            <GoBack
                href={`/`}
                title="Back to Locations"
            />
            <div className="container mx-auto px-4 py-5">
                <StreetFeed
                    id={streetId}
                    start={start}
                    perPage={perPage}
                />
            </div>
        </main>
    )
}







