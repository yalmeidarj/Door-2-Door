"use client";

import * as React from "react";
import Link from "next/link";
import SigninButton from "./SigninButton";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import UserMenu from "./UserMenu";
import ListItem from "./ListItem";

const components = [
    {
        title: "Home",
        href: "/",
        description: "Home page",
    },
    {
        title: "Sites's info",
        href: "/infolocation",
        description: "View detailed info for each site",
    },
    {
        title: "Settings",
        href: "/admin",
        description: "Create, update, and delete sites/users",
    },
    {
        title: "Instructions",
        href: "/instructions",
        description: "Instructions for using the website",
    },
    {
        title: "SalesForce",
        href: "/seeding",
        description: "View all houses not updated in SalesForce",
    },
];

const OperationsMenu = () => (
    <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-slate-200">Operations</NavigationMenuTrigger>
        <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                    <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        className=""
                        description={component.description}
                    />
                ))}
            </ul>
        </NavigationMenuContent>
    </NavigationMenuItem>
);

export function AppBar() {
    return (
        <div className="w-full bg-slate-200 shadow-sm">
            <NavigationMenu>
                <NavigationMenuList>
                    <OperationsMenu />
                    <UserMenu />
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

export default AppBar;