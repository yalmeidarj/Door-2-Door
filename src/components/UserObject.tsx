"use client"
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserObject() {

    const { data: session, status } = useSession();
    if (status === "loading") return null;
    if (session) {
        const user = session.user;
        return (
            <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Expires{session.expires}</p>

            </>
        );
    } else {
        return (
            <button className="text-lg font-bold" onClick={() => signIn()}>
                Sign In
            </button>
        );
    }
}