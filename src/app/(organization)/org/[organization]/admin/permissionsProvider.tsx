"use client";
import { useQuery } from "convex/react";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";


export default function PermissionProvider(
    { id, secret, children }: { id: string; secret: string; children?: React.ReactNode }
) {

    const userId = id as Id<"users">;
    // const pathname = usePathname()


    const user = useQuery(api.authAdapter.getUser, {
        id: userId,
        secret: secret,
    });

    if (!user) {
        return <div>No User Found...</div>;
    }

    if (user.role === "user" || user.role === undefined) {
        
        return <AdminOnlyPage />;
    }

    return (
        <div className=" w-full ">
            {children}
        </div>
    );
}

function AdminOnlyPage() {
    return (
        < div className="w-full h-screen flex flex-col items-center justify-center" >
            <h1 className="text-2xl font-bold">You have no access to this page.</h1>
            <p className="text-gray-600">
                You must be an admin to access this page. If you think this is a mistake, please contact an admin.
            </p>
        </div>
    )
}