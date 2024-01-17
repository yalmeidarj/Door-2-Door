import HousesTable from "@/components/HouseTable";
import { updateManyHousesNo, updateManyHousesYes } from "@/lib/HouseStats/actions";

export default async function Page() {

    const result = await updateManyHousesNo()
    const resultYes = await updateManyHousesYes()
    return (
        <>
            <HousesTable />
            {result.count} |
            {resultYes.count}
        </>
    );
}