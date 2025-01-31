"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import AgentName from "./AgentName"

export default function AllUsersInSite({ siteId }: { siteId: string }) {
  
  const allUsersInOrg = useQuery(api.shiftLogger.getActiveShiftsBySiteId, { siteId: siteId})
    if (!allUsersInOrg) {
        return <div>Loading...</div>;
  }
  
    return (
        <ul className="text-sm text-gray-600">
            {allUsersInOrg.map((user, index) => (
              <li key={index}><AgentName id={user.userID}/></li>
            ))}
          </ul>
    )
}