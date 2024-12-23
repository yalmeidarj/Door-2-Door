// "use client"
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import OrgRouter from "./orgRouter";


const routeLinks = [
    { name: "Home", link: "/" },
    { name: "Organizations", link: "/org" },
]

export default function Page() {

    // const organizations = useQuery(api.organization.getAllOrganizations);
    // if (!organizations) {
    //     return <div>Loading...</div>;
    // }

    return (
        <>
        {/* <PageHeader
                routes={routeLinks}
                /> */}                            
        <div className="w-full">
                <div className="container  h-screen">
                    
            <div
                className="w-full max-w-4xl mx-auto p-4 rounded-md bg-slate-50"
                >
            <h1 className="text-2xl font-bold mb-4">Organizations</h1>
            {/* {organizations.map(organization => (
                <div key={organization._id}>
                <Link
                href={`/org/${organization.name}?id=${organization._id}`}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Link to Organization"
                >
                {organization.name}
                </Link>
                </div>
                ))}                 */}
            </div>
            </div>                   
        </div>
                    </>
    );
}

