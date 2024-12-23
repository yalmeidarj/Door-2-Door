"use client"
import { BsPersonWalking } from "react-icons/bs";
import { FaHome, FaCheck, FaTimes } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiForbidLine } from "react-icons/ri";
import { defaultValues } from "@/lib/utils";
import Link from "next/link";
import { StreetType } from "@/lib/streets/types";
import { MdEngineering } from "react-icons/md";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const StreetCard = ({ streetId, name }: { streetId: string, name: string }) => {
    


    const allHouses = useQuery(api.house.getStatsHousesByStreetId, { streetId });
    const getVisitedHousesByStatusAttempt = useQuery(api.house.getVisitedHousesByStatusByStreetId, { streetId });
    const visitRequired = useQuery(api.house.getHousesVisitRequestByStreetId, { streetId });
    const housesWithConsentYes = useQuery(api.house.getHousesConsentYesByStreetId, { streetId });
    const housesWithConsentNo = useQuery(api.house.getHousesConsentNoByStreetId, { streetId });

    
    return (
        <>
            {/* <Link
                // key={id}
                // href={`/houses/${name}?id=${id}&per_page=${defaultPerPage}&page=${defaultPage}&viewAll=${viewAll}`}
                href="#"*/}
                <div
                className="flex items-center justify-between
                 bg-white hover:bg-gray-100 p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition ease-in-out duration-300
                 mb-5 cursor-pointer
                 w-screen
                 max-w-[320px]
                 mx-2
                 md:max-w-[380px]"> 
            <div>
                <h1 className="text-md font-semibold text-blue-800">
                    {name}
                </h1>
                <div className='flex flex-row gap-2 '>

                    <div className='flex items-center space-x-1'>
                        <FaHome className="mr-1" aria-label="Houses" />
                            <span>{allHouses?.length}</span>
                    </div>

                </div>
                {/* <p className="text-sm text-gray-600">Last Visit:
                    {lastVisited?.toLocaleDateString() || 'N/A'}
                </p> */}
            </div>

            <div className="flex flex-col gap-4  text-gray-600 text-sm pb-2">

                <div className='flex space-x-2 justify-end border-solid border-b-2 border-gray-300 pb-2'>
                    <div className='flex flex-col items-center justify-center space-y-1'>
                        <div className='flex items-center space-x-1'>
                            <IoIosCheckmarkCircleOutline className="text-green-600" aria-label="Final Yes" />
                                <span>{housesWithConsentYes?.length}</span>
                        </div>
                        <h2 className='text-xs'>Yes</h2>
                    </div>

                    <div className='flex flex-col items-center justify-center space-y-1'>
                        <div className='flex items-center space-x-1'>
                                {/* <BsPersonWalking className="mr-1" aria-label="Not Visited" /> */}
                                <MdEngineering className="text-lg mr-1" />
                                <span>{visitRequired?.length}</span>
                        </div>
                        <h2 className='text-xs'>Visit Required</h2>
                    </div>

                    <div className='flex flex-col items-center justify-center space-y-1'>
                        <div className='flex items-center space-x-1'>
                            <RiForbidLine className="mr-1 text-red-600" aria-label="Not Visited" />
                                <span>{housesWithConsentNo?.length}</span>
                        </div>
                        <h2 className='text-xs'>No</h2>
                    </div>
                </div>

                <div className='flex space-x-2 justify-end'>
                    <div className='flex flex-col items-center justify-center space-y-1'>
                        <div className='flex items-center space-x-1'>
                            <FaCheck className="mr-1" aria-label="Visited" />
                                <span>{getVisitedHousesByStatusAttempt?.length}</span>
                        </div>
                        <h2 className='text-xs'>Visited</h2>
                    </div>

                        <div className='flex flex-col items-center justify-center space-y-1'>
                        {allHouses && getVisitedHousesByStatusAttempt && allHouses.length === getVisitedHousesByStatusAttempt.length ? (
                            <div className='flex items-center space-x-1'>
                                <FaTimes className="mr-1" aria-label="Not Visited" />
                                <span>{allHouses.length - getVisitedHousesByStatusAttempt.length}</span>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-1'>
                                <FaTimes className="mr-1" aria-label="Not Visited" />
                                <span>...</span>
                            </div>
                        )
                        }
                        <h2 className='text-xs'>Not Visited</h2>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default StreetCard;