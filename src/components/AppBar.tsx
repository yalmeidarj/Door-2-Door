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
        title: "Home",
        href: "/",
        description:
            "Home page",
    },
    {
        title: "Sites's info",
        href: "/infolocation",
        description:
            "View detailed info for each site",
    },
    {
        title: "Settings",
        href: "/admin",
        description:
            "Create, update, and delete sites/ users",
    },
    {
        title: "Instructions",
        href: "/instructions",
        description:
            "Instructions for using the website",
    }

]

export function AppBar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Operations</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    title={component.title}
                                    href={component.href}
                                    className=""
                                    description={component.description}
                                />
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                
                <UserMenu />

            </NavigationMenuList>
        </NavigationMenu>
    )
}


export default AppBar;