import Link from "next/link"
import PaginationControls from "@/components/PaginationControls"
import { getHousesInStreet, getStreetsInLocation } from "@/app/actions/actions"
import { defaultValues } from "@/lib/utils"
import GoBackButton from "@/components/GoBack"
import GoBack from "@/components/GoBack"
import { FaHome, FaCheck, FaTimes, FaCircle } from 'react-icons/fa';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsPersonWalking } from "react-icons/bs";
import { RiForbidLine } from "react-icons/ri";

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
            <GoBack
                href={`/`}
                title="Back to Locations"
            />
            <PaginationControls
                metadata={paginationControls}
            />
            <div className="container mx-auto px-4 py-5">
                {streetsInLocations.data.map((street) => (
                    <Link key={street.id} href={`/houses/${street.name}?id=${street.id}&per_page=${perPage}&page=${page}`}
                        className="flex items-center justify-between bg-white hover:bg-gray-100 p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition ease-in-out duration-300 mb-5 cursor-pointer">

                        <div>
                            <h1 className="text-md font-semibold text-blue-800">
                                {street.name}
                            </h1>
                            <div className='flex flex-row gap-2 '>
                            
                            <div className='flex items-center space-x-1'>
                                <FaHome className="mr-1" aria-label="Houses" />
                                <span>{street.totalHouses}</span>
                            </div>
                            {/* <div className='flex items-center space-x-1'>
                                <IoIosCheckmarkCircleOutline className="text-green-600" aria-label="Final Yes" />
                                <span>{street.totalHousesWithConsentYes}</span>
                            </div> */}
                            </div>
                            <p className="text-sm text-gray-600">Last Visit:
                                {street.lastVisited?.toLocaleDateString() || 'N/A'}
                            </p>
                            
                        </div>

                        <div className="flex flex-col gap-4  text-gray-600 text-sm pb-2">

                            <div className='flex space-x-2 justify-end border-solid border-b-2 border-gray-300 pb-2'>
                                <div className='flex flex-col items-center justify-center space-y-1'>
                                    <div className='flex items-center space-x-1'>
                                        <IoIosCheckmarkCircleOutline className="text-green-600" aria-label="Final Yes" />
                                        {/* <FaCheck className="mr-1" aria-label="Final Yes" /> */}
                                        <span>{street.totalHousesWithConsentYes}</span>
                                    </div>
                                    <h2 className='text-xs'>Yes</h2>
                                </div>

                                <div className='flex flex-col items-center justify-center space-y-1'>
                                    <div className='flex items-center space-x-1'>
                                        <BsPersonWalking  className="mr-1" aria-label="Not Visited" />
                                        <span>{street.totalHousesWithVisitRequired}</span>
                                    </div>
                                    <h2 className='text-xs'>Visit Required</h2>
                                </div>

                                <div className='flex flex-col items-center justify-center space-y-1'>
                                    <div className='flex items-center space-x-1'>
                                        <RiForbidLine className="mr-1 text-red-600" aria-label="Not Visited" />
                                        <span>{street.totalHousesWithConsentNo}</span>
                                    </div>
                                    <h2 className='text-xs'>No</h2>
                                </div>
                            </div>

                            <div className='flex space-x-2 justify-end'>
                                <div className='flex flex-col items-center justify-center space-y-1'>
                                    <div className='flex items-center space-x-1'>
                                        <FaCheck className="mr-1" aria-label="Visited" />
                                        <span>{street.totalHousesVisited}</span>
                                    </div>
                                    <h2 className='text-xs'>Visited</h2>
                                </div>
                                <div className='flex flex-col items-center justify-center space-y-1'>
                                    <div className='flex items-center space-x-1'>
                                        <FaTimes className="mr-1" aria-label="Not Visited" />
                                        <span>{street.leftToVisit}</span>
                                    </div>
                                    <h2 className='text-xs'>Not Visited</h2>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    )
}

 

