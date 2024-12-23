import AdminNavigation from "@/components/AdminNavigation ";
import PageHeader from "@/components/PageHeader";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined, org: string | undefined }
}) {

    const routeLinks = [
        // {
        //     name: "Sites",
        //     link: `/org/site?id=${searchParams.org as string}`
        // },
        {
            name: "SalesForce Conciliation",
        },
    ]

    return (
        <div className="w-full ">
            <PageHeader
                routes={routeLinks}
            />
            <AdminNavigation />

        </div>
    );
}