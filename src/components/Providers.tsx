'use client'

import { ConvexClientProvider } from "@/app/ConvexClientProvider"
import { SessionProvider } from "next-auth/react"

export default function Provider({
    children,
    session
}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {
    return <SessionProvider session={session}>
        <ConvexClientProvider>
        {children}
        </ConvexClientProvider>
    </SessionProvider>
}