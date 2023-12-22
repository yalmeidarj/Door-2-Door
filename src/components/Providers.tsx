// "use client"
// // import React from "react"
// import { SessionProvider } from "next-auth/react"

// // type Props = {
// //     children: React.ReactNode
// // }
    
// // const Providers = ( props : Props) => {
// //     return (
// //         <SessionProvider >
// //             {props.children}
// //         </SessionProvider>
// //     )
// // }

// export default SessionProvider;
'use client'

import { SessionProvider } from "next-auth/react"

export default function Provider({
    children,
    session
}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {
    return <SessionProvider session={session}>
        {children}
    </SessionProvider>
}