import Link from "next/link";
import UserObject from "../components/UserObject";
import { getLocations } from "@/app/actions/actions"
import Form from "../components/Form";
import { error } from "console";


export default async function HomePage() {
  const data = await getLocations();
  if (Array.isArray(data) && data.length > 0) {
    return (
      <div>
        {data.map((location: location) => (
      <SiteCard key={location.id} props={location} />
    ))}
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="text-2xl font-bold">Locations</h1>
        <div className="flex flex-col flex-wrap justify-center text-gray-600">
          <div className="bg-white rounded-lg shadow-xl p-4 m-4 w-80">
            <h2 className="text-xl font-bold">No Locations</h2>
            <p className="text-gray-600">Please add a location</p>
            <Link href={`/locations/new`}>
              Add
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

type location = {
  id: number;
  name: string | null;
  neighborhood: string;
  priorityStatus: number;
  // error: string;
}; 

type SiteCardProps = {
  props: location;
};  


async function SiteCard({ props }: SiteCardProps) {

  return (
    <>
      <h1 className="text-2xl font-bold">Locations</h1>
      <div className="flex flex-col flex-wrap justify-center text-gray-600">
        <div className="bg-white rounded-lg shadow-xl p-4 m-4 w-80">
          <h2 className="text-xl font-bold">{props.name}</h2>
          <p className="text-gray-600">{props.neighborhood}</p>
          <p className="text-gray-600">{props.priorityStatus}</p>
          <Link href={`/streets/${props.name}?id=${props.id}`}>
            View
          </Link>
        </div>

      </div>
    </>
  );
}


