
import PageHeader from "@/components/PageHeader";
import HousesNotInSalesForce from "./housesNotInSalesForce";
import HouseEditLog from "./HouseLog";
import { auth } from "@/auth";
// import HouseLog from "./HouseLog";

export default async function Page() {
    // get session
    const session = await auth();
    if (!session || !session.user) {
        console.log("no session")
        return null
    }

    const userId = session.user.id as string;
    const routeLinks = [
        {
            name: "Organization",
            link: "/org"
            // link: `/org/site?id=${searchParams.id}`            
        },
        {
            name: "Seeding",
        },
    ]
    return (
        <div className="flex flex-col items-center h-screen">
            <PageHeader
                routes={routeLinks}
            />
            <div className="container  items-center justify-center">
                   
                <HousesNotInSalesForce
                    userId={userId}
                />
                {/* <HouseEditLog /> */}
                
                {/* <HouseLog /> */}
        </div>       
        </div>
    )
}