import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/server/auth";
import GoBack from "@/components/GoBack"
import { houseCurrentStreet } from "@/lib/houses/helperFunctions"
import HousesFeed from "@/components/HouseFeed"
import PageHeaderInfo from "@/components/PageHeaderInfo";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined }
}) {

    const session = await getServerSession(authOptions);
    const page = Number(searchParams['page']) ?? 1
    const perPage = Number(searchParams['per_page']) ?? 2
    const start = (page - 1) * perPage
    const streetId = searchParams.id

    if (!streetId) {
        return <div>Invalid id...</div>
    }

    const street = await houseCurrentStreet(Number(streetId))
    if (!street || !street.Street) {
        return <div>Something went wrong</div>
    }

    const feed = {
        id: streetId,
        start: start,
        perPage: perPage,
        userId: session?.user.id as string
    } 

    const URL = `/streets/${street.Location.name}?id=${street.Location.id}&per_page=${perPage}&page=${page}`
    return (
        <main className="flex flex-col items-center bg-gray-100 p-4">
            <PageHeaderInfo 
                route={street.Street.name}
                >
                <GoBack
                    href={URL}
                    title={`${street.Location.name} Streets`}
                />
            </PageHeaderInfo>            
            <HousesFeed
                feed={feed}
            />
        </main>
    )
}


