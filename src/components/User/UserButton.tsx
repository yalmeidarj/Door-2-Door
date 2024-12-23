import { auth } from "@/auth"

import SignOut from "../auth-components/SignOut"
import SignIn from "../auth-components/SignIn"

export default async function UserButton() {
    const session = await auth()

    if (!session) {
        return (
            <>
             <SignIn />
            </>
        )
    }
    return (
        <div className="flex flex-col w-full  bg-white">
            <span className="text-slate-600 ">{session.user.name}</span>
            <SignOut />
        </div>
    )
}



