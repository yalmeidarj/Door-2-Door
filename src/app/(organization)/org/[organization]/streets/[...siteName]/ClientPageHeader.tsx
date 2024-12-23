"use client"

import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import PageHeader from "../../../../../../components/PageHeader";
import { usePathname } from "next/navigation";


type PageHeaderProps = {
    id: string;
    type: "siteId" | "streetId" | "houseId";
}
    

export default async function ClientPageHeader({ data, children }: { data: PageHeaderProps, children: React.ReactNode }) {
    const { id, type } = data

    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    // get the type of id before query    
    
    const street = useQuery(api.street.getStreetsByStreetId, { streetID: id });
    const siteId = street?.siteID
    const streetName = street?.name as string;

    const routeLinks = (orgName: string) => ([
        {
            name: "Streets",
            link: `/org/${orgName}/streets/back/?site=${siteId}`
        },
        {
            name: `${streetName.toString().replace(/%20/g, ' ')}`,
        },
    ]
    )
    const routes = routeLinks(orgName);
    return (
        <>
            <PageHeader
                routes={routes}
            />
        {children}
        </>
    )

}
    