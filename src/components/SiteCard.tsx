import { defaultValues } from "@/lib/utils";
import Link from "next/link";

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


export async function SiteCard({ props }: SiteCardProps) {

  const {defaultPage: page, defaultPerPage: perPage} = defaultValues

  return (
    <>
      <div className="flex flex-col flex-wrap justify-center text-gray-600">
        <div className="bg-white rounded-lg shadow-xl p-4 m-4 w-80">
          <h2 className="text-xl font-bold">{props.name}</h2>
          <p className="text-gray-600">{props.neighborhood}</p>
          <p className="text-gray-600">{props.priorityStatus}</p>
          <Link href={`/streets/${props.name}?id=${props.id}&per_page=${perPage}&page=${page}`}>
            View
          </Link>
        </div>
      </div>
    </>
  );
}