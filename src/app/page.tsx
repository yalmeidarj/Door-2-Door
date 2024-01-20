import { defaultValues } from "@/lib/utils";
import SiteFeed from "@/components/SiteFeed";

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
  const start = (Number(page) - 1) * Number(perPage)     
    
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Sites</h1>
      <SiteFeed start={start} perPage={perPage} />
    </div>
  );
}
  






