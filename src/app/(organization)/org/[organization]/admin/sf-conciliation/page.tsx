import AdminNavigation from "@/components/AdminNavigation ";
import PageHeader from "@/components/PageHeader";

export default function Page() {

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