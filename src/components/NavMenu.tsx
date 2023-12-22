"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from 'next/navigation'


function AuthButton() {
    const { data: session, status } = useSession();
    if (status === "loading") return null;
    if (session) {
        const user = session.user;
        return (
            <>
                <h1>{user.name}</h1>
                <button className="text-lg font-bold" onClick={() => signOut()}>
                    Sign Out
                </button>
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

export default function NavMenu() {
    return (
        <nav className="flex items-center justify-between w-full max-w-6xl px-4 py-8 mx-auto">
            <Link href="/">
                Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
            </Link>
            <div className="flex items-center justify-between gap-4">
                <Link href="user" >
                    User
                </Link>
                <Link href="https://create.t3.gg/en/introduction" target="_blank">
                    Dashboard
                </Link>
                <AuthButton />
            </div>
        </nav>
    );
}