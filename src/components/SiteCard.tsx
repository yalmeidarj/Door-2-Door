import { SiteCardProps } from "@/lib/sites/types";
import { defaultValues } from "@/lib/utils";
import Link from "next/link";

export async function SiteCard({ props }: SiteCardProps) {

  const {defaultPage: page, defaultPerPage: perPage} = defaultValues

  // Convert BigInt to String for rendering
  const totalHousesString = props.totalHouses.toString();

  console.log("SiteCard Props:", props);

  // Extracting active user names from the ShiftLogger array
  const activeUsers = props.ShiftLogger
    .filter(logger => !logger.isFinished)
    .map(logger => logger.User.name);


  return (
    <>
      <div className="flex flex-col flex-wrap justify-center text-gray-600">
            <Link href={`/streets/${props.name}?id=${props.id}&per_page=${perPage}&page=${page}`}
            className=" hover:text-blue-700 text-sm font-semibold">
        <div className="bg-white rounded-lg shadow-lg p-3 m-4 w-80">
          <h2 className="text-xl font-bold mb-1">{props.name}</h2>
          <p className="text-gray-500 text-sm mb-2">{props.neighborhood === 'to be verified' ? 'Neighborhood' : props.neighborhood}</p>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col justify-center text-center items-center">
              <i className="fas fa-home text-green-500 text-lg"></i>
              <span className="text-green-500 text-md font-medium">{totalHousesString}</span>
              <p className="text-gray-500 text-xs font-semibold mt-1">Houses</p>
            </div>
            <div className="flex flex-col justify-center text-center items-center">
              <i className="fas fa-walking text-blue-500 text-lg"></i>
                <span className="text-blue-500 text-md font-medium">{props.leftToVisit}</span>
                <p className="text-gray-500 text-xs font-semibold mt-1">To be visited</p>
            </div>
          </div>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col justify-center text-center items-center">
              <i className="fas fa-home text-green-500 text-lg"></i>
                <span className="text-green-500 text-md font-medium">{props.totalHousesWithConsentYes}</span>
                <p className="text-gray-500 text-xs font-semibold mt-1">Yes</p>
            </div>
            <div className="flex flex-col justify-center text-center items-center">
              <i className="fas fa-walking text-blue-500 text-lg"></i>
                <span className="text-blue-500 text-md font-medium">{props.totalHousesWithConsentNo}</span>
                <p className="text-gray-500 text-xs font-semibold mt-1">No</p>
            </div>
            <div className="flex flex-col justify-center text-center items-center">
              <i className="fas fa-walking text-blue-500 text-lg"></i>
                <span className="text-blue-500 text-md font-medium">{props.totalHousesWithToBeVisited}</span>
                <p className="text-gray-500 text-xs font-semibold mt-1">Visit required</p>
            </div>
          </div>
            {/* Active Users Section */}
            <div className="mt-3 text-center">
              <h3 className="text-md font-medium text-gray-700">Active Users</h3>
              <ul className="flex flex-row gap-2">
                {activeUsers.map((user, index) => (
                  <li key={index} className="text-sm text-gray-600">| {user.split(' ')[0]}</li>
                  ))}
                  
              </ul>
            </div>
        </div>
            </Link>
      </div>
    </>
  );
}