"use client"

import * as React from "react"
import Link from "next/link"
import SigninButton from "./SigninButton"
import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getActiveShiftByAgentId } from "@/app/actions/actions"
import UserMenu from "./UserMenu"
import ListItem from "./ListItem"

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    }
]

export function AppBar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <ListItem
                             href="/docs"
                              title="Introduction"
                              description=""
                              />
                                
                            
                            <ListItem
                             href="/docs/installation"
                              title="Installation"
                              description=""
                              />
                                
                            
                            <ListItem
                             href="/docs/primitives/typography"
                              title="Typography"
                              description=""
                              />
                                
                            
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>User</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    title={component.title}
                                    href={component.href}
                                    className=""
                                    description={""}
                                />
                                
                                // <Link
                                //     href={component.href}
                                // >
                                //     <div className="text-sm font-medium leading-none">
                                //         {component.title}
                                //     </div>
                                //         <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                //             {component.description}
                                //         </p>
                                // </Link>
                            ))}
                            {/* <ListItem
                                title="User Profile"
                                // href={`/docs/agents/profile?agentId=${}`}
                                className="col-span-2"
                            > */}
                            {/* User Profile */}
                                
                                
                            {/* </ListItem> */}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <UserMenu />
                {/* <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Documentation
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem> */}
            </NavigationMenuList>
        </NavigationMenu>
    )
}



// import SigninButton from "./SigninButton";


// const AppBar = () => {
//     return (
//         <header className="flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow ">
//             <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/"}>
//                 Home
//             </Link>
//             <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/profile"}>
//                 User Profile
//             </Link>
//             <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/admin"}>
//                 Admin Dashboard
//             </Link>

//             <SigninButton />
//         </header>
//     );
// };

export default AppBar;