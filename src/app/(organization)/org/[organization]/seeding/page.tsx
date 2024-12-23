
import PageHeader from "@/components/PageHeader";
import HousesNotInSalesForce from "./housesNotInSalesForce";
import HouseEditLog from "./HouseLog";
// import HouseLog from "./HouseLog";

export default  function Page() {

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
        <div className="flex flex-col items-center">
            <PageHeader
                routes={routeLinks}
            />
        <div className="w-full container items-center justify-center">
                <div className="container">                    
                    <HousesNotInSalesForce />
                {/* <HouseEditLog /> */}
                </div>
                
                {/* <HouseLog /> */}
        </div>
        
        </div>
    )
}