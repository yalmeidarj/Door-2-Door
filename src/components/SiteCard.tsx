import { getLocationTotalHoursSpentByAllUsers } from "@/lib/sites/helperFunctions";
import { SiteCardProps } from "@/lib/sites/types";
import { defaultValues } from "@/lib/utils";
import { error } from "console";
import Link from "next/link";
import { number } from "zod";

export async function SiteCard({ props }: SiteCardProps) {

  const {defaultPage: page, defaultPerPage: perPage} = defaultValues

  // Convert BigInt to String for rendering
  const totalHousesString = props.totalHouses.toString();

  const totalHoursSpent = await getLocationTotalHoursSpentByAllUsers(props.id);

  if (typeof totalHoursSpent !== 'number' ) {
    return 'No Hours for this site...';
  } 

  // Extracting active user names from the ShiftLogger array
  const activeUsers = props.ShiftLogger
    .filter(logger => !logger.isFinished)
    .map(logger => logger.User.name);


  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 w-sm m-4 max-w-sm">
        <div className='flex flex-row justify-between items-center mb-2 gap-2 '>
        <div className=' '>
        
          <header className="text-lg font-semibold">{props.name}</header>
        {/* <p className="text-gray-500 text-sm mb-2">
          {props.neighborhood === 'to be verified' ? 'Neighborhood' : props.neighborhood}
          </p> */}
        </div>
          <div className="flex flex-col border-dotted px-2 border-gray-300 border-2 text-blue-500 text-md font-semibold rounded-sm">
              {Number(totalHoursSpent / 2).toFixed(2)}
            <p className="text-gray-500 text-xs">Hours</p>
            </div>
        
        </div>
        
        <div className="flex flex-row justify-between mb-2">
          <div className="text-center">
            <div className="text-green-500 text-md font-semibold">
              {totalHousesString}
            </div>
            <p className="text-gray-500 text-xs">Houses</p>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
              {props.leftToVisit}
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
              {props.totalHousesWithConsentYes}
            </div>
            <p className="text-gray-500 text-xs">Yes</p>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
              {props.totalHousesWithConsentNo}
            </div>
            <p className="text-gray-500 text-xs">No</p>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-md font-semibold">
              {props.totalHousesWithToBeVisited}
            </div>
            <p className="text-gray-500 text-xs">Visit required</p>
          </div>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="mt-3">
          <h3 className="text-md font-semibold text-gray-700">Active Users</h3>
          <ul className="text-sm text-gray-600">
            {activeUsers.map((user, index) => (
              <li key={index}>{user?.split(' ')[0]}</li>
            ))}
          </ul>
        </div>
      </div>


    </>
  );
}