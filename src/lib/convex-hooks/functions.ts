import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

// export const newSiteAction = async (data: FormData) => {

//     const newSiteData = data

export function getSiteHouseStats(siteId: string) {
    const allHouses = useQuery(api.house.getHousesBySiteId, { siteId });

    if (!allHouses) {
        return 0;
    }

    return allHouses
}