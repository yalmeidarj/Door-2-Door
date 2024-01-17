import { db } from "@/server/db";

// export const getHousesConsentFinalYesByLocationId = async (locationId: number) => {
//     const result = await db.query(
//         `SELECT COUNT(*) AS count FROM house_stats WHERE location_id = $1 AND consent_final = 'yes'`,
//         [locationId]
//     );
//     return result.rows[0].count;
//     };

export const updateManyHousesYes = async () => {
    const houses = await db.house.updateMany({
        where: { statusAttempt: "Consent Final Yes" },
        data: { consent: "Yes" },

    })
    return houses;
}

export const updateManyHousesNo = async () => {
    const houses = await db.house.updateMany({
        where: { statusAttempt: "Consent Final No" },
        data: { consent: "No" },

    })
    return houses;
}