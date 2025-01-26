import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { createNavItems } from "./nav-items";
import SignOut from "../auth-components/SignOut";



export function AppSidebar({ orgName }: { orgName: string }) { 
    
    const navItems = createNavItems(orgName)
    return (
        <Sidebar className="">
            <SidebarHeader className='bg-night text-white'><SidebarTrigger /></SidebarHeader>
            <SidebarContent className='bg-night pl-4 text-white'>
                <SidebarGroup>                    
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {navItems.header.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.link}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='bg-night text-white w-full'>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {navItems.footer.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton >
                                        <Link
                                            href={item.link}
                                            // onClick={() => {
                                                
                                            // }}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem key="User">
                                <SidebarMenuButton asChild>
                                    <DropdownMenu >
                                        <DropdownMenuTrigger>{navItems.user.name}</DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-full bg-night p-4 text-white '>
                                                <DropdownMenuItem key={navItems.user.name}>
                                                <Link
                                                    className="flex items-center gap-2"
                                                    href={navItems.user.link}>                                                    
                                                {navItems.user.icon} 
                                                <span>Shifts</span>
                                            </Link>
                                                </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem key={navItems.user.link}>
                                                {navItems.user.icon} 
                                                <SignOut />
                                                {/* <Link
                                                    className="flex items-center gap-2"
                                                    href={navItems.user.link}>                                                    
                                            </Link> */}
                                                </DropdownMenuItem>
                                            {/* <DropdownMenuLabel className='bg-slate-400 text-gray-300'>My Account</DropdownMenuLabel> */}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* <Link href={navItems.user.link}>
                                        {navItems.user.icon}
                                    </Link> */}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>                
            </SidebarFooter>
        </Sidebar>
    )
}

function UserMenu() {
    return (
        <DropdownMenu>
            {/* <DropdownMenuTrigger>{navItems.user.name}</DropdownMenuTrigger> */}
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <Link href={navItems.user.link}>
                    <DropdownMenuItem>
                        Shifts
                    </DropdownMenuItem>
                </Link> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}