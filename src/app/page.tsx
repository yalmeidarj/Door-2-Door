import Link from "next/link";
import { getLocations } from "@/app/actions/actions"
import { defaultValues } from "@/lib/utils";
import { skip } from "node:test";
import PaginationControls from "@/components/PaginationControls";
import { SiteCard } from "@/components/SiteCard";
import GoBackButton from "@/components/GoBack";



export default async function HomePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [id: string]: string | string[] | undefined }
  }) {
  
  const { defaultPage, defaultPerPage } = defaultValues
  const page = Number(searchParams.page) || Number(defaultPage )
  const perPage = Number(searchParams.per_page) || Number(defaultPerPage)
  const start = (page - 1) * perPage


  const data = await getLocations(start, perPage)
  
  if (data.metadata === undefined) {
    // console.log(data.data?.leftToVisit)
    console.log(page)
    console.log(perPage)
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

    console.log(`Total Houses: ${data.data.map((location: any) => location.totalHouses)}`)
    
    return (
      <div>
        <h1 className="text-2xl font-bold">Locations</h1>
        <PaginationControls
          metadata={paginationControls}
        />
        <div className="flex flex-row flex-wrap justify-center text-gray-600">
        
          {data.data.map((location: any) => (
            
          <SiteCard key={location.id} props={location} />
          ))}
          </div>
        
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




