import Link from "next/link";
import { getLocations } from "@/app/actions/actions"
import { defaultValues } from "@/lib/utils";
import { skip } from "node:test";
import PaginationControls from "@/components/PaginationControls";
import { SiteCard } from "@/components/SiteCard";
import GoBackButton from "@/components/GoBackButton";



export default async function HomePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [id: string]: string | string[] | undefined }
  }) {
  
  const { defaultPage, defaultPerPage } = defaultValues
  const start = (Number(defaultPage) - 1) * Number(defaultPerPage)


  const data = await getLocations(start, defaultPerPage)
  
  if (data.metadata === undefined) {
    console.log(data)
    console.log(data.metadata)
    return <div>loading...</div>;
  }

  if (Array.isArray(data.data) && data.data.length > 0) {

    const paginationControls = {
      state: {
        perPage: defaultPerPage,
        currentPage: defaultPage,
      },
      data: 
        data.metadata      
    }
    
    return (
      <div>
        {/* <GoBackButton /> */}
        <PaginationControls
          metadata={paginationControls}
        />
        {data.data.map((location: any) => (
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




