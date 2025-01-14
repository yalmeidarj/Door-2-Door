"use client"

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
// import PageHeader from "./PageHeader";
import { usePathname } from "next/navigation";
import { FaGreaterThan } from "react-icons/fa6";
import Link from "next/link";
import ShiftHandler from "./ShiftHandler";
import { Separator } from "./ui/separator";


type PageHeaderProps = {
    streetId: string;
    userId: string;
}
    

export default function ClientPageHeader({ data }: { data: PageHeaderProps}) {
    const { streetId, userId } = data

    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    // get the type of id before query    
    
    const street = useQuery(api.street.getStreetsByStreetId, { streetID: streetId });
    const site = useQuery(api.site.getSiteByStreetId, { id: streetId });
    // const userId = useQuery(api.users.
    if (!street) {
        return (<div className=' '>
        loading...
        </div>)
    }
    const siteId = street.siteID
    if (!site) {
        return (<div className=' '>
        loading...
        </div>)
    }
    const streetName = street.name as string;

    const routeLinks = (orgName: string) => ([
        {
            name: `${site.name.toLocaleUpperCase()}`,
            link: `/org/${orgName}/streets/${site.name}/?site=${siteId}`
        },
        {
            name: `${streetName.toString().replace(/%20/g, ' ')}`,
        },
    ]
    )
    const routes = routeLinks(orgName);
    return (
        <>
            {/* <PageHeader
                routes={routes}
            /> */}
            {/* {children} */}
            <div className="w-full ">
                <div className="flex justify-between h-9 items-center md:pl-14 md:pr-8 pl-4 pr-1 mx-auto">
                    <div className="flex items-center gap-1 mb-1 text-gray-500">
                        {routes.map((route, index) => (
                            <div className="flex items-center" key={index}>
                                {index > 0 && (
                                    <FaGreaterThan className="text-xs mx-2 text-gray-400" />
                                )}
                                {route.link ? (
                                    <Link href={route.link} className="text-sm font-bold hover:text-gray-700">
                                        {route.name}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-bold">{route.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <ShiftHandler
                        userId={userId}
                    />
                </div>
                <Separator className="w-full" />
            </div>
        </>
    )

}
    