"use client"

import { useQuery } from "convex/react"
import { useSession } from "next-auth/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function OrgRouter() {
    
    const {data: session} = useSession()

    const user = useQuery(api.users.getUserById, { id: session?.user?.id as Id<"users"> });


    if (!user?.organizationId) {
        const allOrganizations = useQuery(api.organization.getAllOrganizations)
        return (
            <div  className="w-full h-screen ">
                <div className="container flex flex-col items-center justify-center">
                You have not been assigned to an organization
                    <AllOrgsList />
            </div>
            </div>
        )
    }
    const orgId = user.organizationId
    const org = useQuery(api.organization.getOrgById, { id: orgId as Id<"organization"> })
// Check if the user has organization, if it does, redirect to organization page
    if (!org) {
        return (
            <div>
            Searching for organization...
            </div>
        )
    }
    return redirect(`/org/${org.name.replace(" ", "-")}`)        

}
    
function AllOrgsList() {
    const allOrganizations = useQuery(api.organization.getAllOrganizations)
    return (
        <ul className="w-full flex flex-col text-3xl text-blue-300">
            {allOrganizations?.map((org) => (
                <Link key={org._id}
                    href={`/org/${org.name.replace(" ", "-")}`}>
                    <li>
                    {org.name}
                    </li>
                </Link>
            ))}
        </ul>
    )
}
