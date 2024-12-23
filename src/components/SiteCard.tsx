"use client"
import { SiteCardProps } from "@/lib/sites/types";
import { defaultValues } from "@/lib/utils";
import { id } from "convex-helpers/validators";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { usePathname } from "next/navigation";


export function SiteCard({ siteId }: { siteId: string }) {
  const site = useQuery(api.site.getActiveSiteById, { id: siteId });

  const pathName = usePathname();
  const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
  const orgUrlFormat = pathName.split("/")[2].replace("%20", " ");
  // const orgId = site.neighborhood;
  const organization = useQuery(api.organization.getOrgByName, { name: orgName });
  const allHouses = useQuery(api.house.getHousesBySiteId, { siteId: siteId })
  const getVisitedHousesByStatusAttempt = useQuery(api.house.getVisitedHousesByStatusAttempt, { siteId: siteId });
  const toBeVisited = Number(allHouses?.length) - Number(getVisitedHousesByStatusAttempt?.length);
  const visitRequired = useQuery(api.house.getHousesVisitRequestBySiteId, { siteId: siteId });
  const housesWithConsentYes = useQuery(api.house.getHousesConsentYesBySiteId, { siteId: siteId });
  const housesWithConsentNo = useQuery(api.house.getHousesConsentNoBySiteId, { siteId: siteId });
  const totalHoursSpent =useQuery(api.shiftLogger.calculateTotalHoursPerLocationBySiteId, { siteId: siteId as Id<"site"> });


  return (
    <>      
      {site?.map((site) => (
               
        <div
          key={site._id}
        className="bg-white rounded-lg shadow-lg p-4 w-sm m-4 
      cursor-pointer
                 w-screen
                 max-w-[320px]
                 mx-2
                 md:max-w-[380px]
      ">
        <Link
          href={`/org/${orgUrlFormat}/streets/${site.name}?site=${site._id}`}
          // href={`/streets/${props.name}?id=${props.id}&per_page=${perPage}&page=${page}`}
          className="hover:text-blue-700 text-sm font-semibold"
          // aria-label={`Visit ${props.name}`}
        >
        <div className='flex flex-row justify-between items-center mb-2 gap-2 '>
        <div className=' '>
        
                 <header className="text-lg font-semibold">{site.name}</header>
        <p className="text-gray-500 text-sm mb-2">
          {site.neighborhood === 'to be verified' ? 'Neighborhood' : site.neighborhood}
          </p>
        </div>
          <div className="flex flex-col border-dotted px-2 border-gray-300 border-2 text-blue-500 text-md font-semibold rounded-sm">
                {totalHoursSpent &&
                  Number(totalHoursSpent / 2).toFixed(2)}
                <p className="text-gray-500 text-xs">Hours</p>
          </div>        
        </div>
        
        <div className="flex flex-row justify-between mb-2">
          <div className="text-center">
            <div className="text-green-500 text-md font-semibold">
                {allHouses?.length}
            </div>
            <p className="text-gray-500 text-xs">Houses</p>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
                {toBeVisited}
            </div>
            <p className="text-gray-500 text-xs">To be visited</p>
          </div>
          <div className="text-center">
            {/* <div className="text-blue-500 text-md font-semibold">
              {Number(totalHoursSpent / 2).toFixed(2)}
            </div>
            <p className="text-gray-500 text-xs">Hours</p> */}
          </div>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="flex flex-row justify-between my-2">
          <div className="text-center">
            <div className="text-green-500 text-md font-semibold">
                {housesWithConsentYes?.length}
            </div>
              <p className="text-gray-500 text-xs">Yes</p>

          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
                {housesWithConsentNo?.length}
            </div>
            <p className="text-gray-500 text-xs">No</p>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
                {visitRequired?.length}
            </div>
            <p className="text-gray-500 text-xs">Visit required</p>
          </div>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="mt-3">
          <h3 className="text-md font-semibold text-gray-700">Active Users</h3>
          {/* <ul className="text-sm text-gray-600">
            {activeUsers.map((user, index) => (
              <li key={index}>{user?.split(' ')[0]}</li>
            ))}
          </ul> */}
        </div>
      </Link>
      </div>
      ))}
          </>
  );
}