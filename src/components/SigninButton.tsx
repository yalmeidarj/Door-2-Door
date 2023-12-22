"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image"

const SigninButton = () => {
    const { data: session } = useSession();
    
    if (session) {
        return (
            <div className="flex w-full ">
                <button onClick={() => signOut()} className="text-red-600   flex-row flex-wrap w-full bg-blue-50 ">
                {/* <Image
                    className="rounded-full bg-green-200"
                    src={session.user.image ?? ""}
                    width="32"
                    height="32"
                    alt={session.user.name ?? ""}
                    /> */}
                    <div className='flex flex-col w-full  bg-white'>                    
                <span className="text-slate-600 ">{session.user.name}</span>
                    <span className="text-slate-600">Sign Out</span>
                    </div>
                    
                </button>
            </div>
        )
    }
    return (
        <button
            onClick={() => signIn()}
            className="bg-blue-500 px-4 py-2 text-black rounded-md flex flex-col">
            Sign in
        </button>
    )
}

export default SigninButton;