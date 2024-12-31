import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import PersonalShifts from "@/components/PersonalShifts";


export default async function Page() {

    const session = await auth();

    if (!session || !session.user) {

        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">You are not logged in.</h1>
                <p className="text-gray-600">Please, sign in to access this page.</p>
            </div>
        );
    }
    const user = session.user;

    console.log("User ID: ", user.id)

    const routeLinks = [
        // { name: "Home", link: `/org/org?id=${searchParams.id as string}` },
        {
            name: "Sites",
            // link: `/org/site?id=${searchParams.org as string}`
        },
        {
            name: "User Management",
        },
    ]

    return (
        <div className="w-full ">
            <PageHeader
                routes={routeLinks}
            />
            <div className="container flex flex-col items-center ">

                <PersonalShifts
                    agentId={user.id as string}
                // name={session.user.name as string}
                />

            </div>
        </div>
    );
}
