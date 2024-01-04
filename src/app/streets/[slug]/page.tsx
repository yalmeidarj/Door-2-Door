import Link from "next/link"
import PaginationControls from "@/components/PaginationControls"
import { getHousesInStreet, getStreetsInLocation } from "@/app/actions/actions"
import { defaultValues } from "@/lib/utils"
import GoBackButton from "@/components/GoBackButton"

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
    const end = start + Number(perPage)

    const streetId = searchParams.id

    const streetsInLocations = await getStreetsInLocation(streetId, start, perPage)

    if (!streetsInLocations || !streetsInLocations.data) {
        return <div>loading...</div>
    }

    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: Number(page),
        },
        data:
        streetsInLocations.metadata
    }

    


    return (
        <main className="flex flex-col items-center ">
            <GoBackButton />
            <PaginationControls
                metadata={paginationControls}
            />
            {streetsInLocations.data.map((street) => (
            <div key={street.id}
            className = {`flex justify-center`}
                >
                    <Link href={`/houses/${street.name}?id=${street.id}&per_page=${perPage}&page=${page}`}
                         className="flex justify-center w-full">
                            <div className="flex flex-col justify-center items-center p-2">
                                <h1 className="text-xl font-bold leading-tight mb-2 text-center">
                                    {street.name}
                                </h1>
                            </div>                       
                    </Link>


                </div>
            ))}
        </main>
    )
}
