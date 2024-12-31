import {

    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    // DropdownMenuLabel,
    // DropdownMenuPortal,
    // DropdownMenuShortcut,
    // DropdownMenuSub,
    // DropdownMenuSubContent,
    // DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SigninButton from "./SigninButton"
import Link from "next/link"

export default function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <h1 className="cursor-pointer" >
                     User Info
                    </h1>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {/* <DropdownMenuLabel></DropdownMenuLabel> */}
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link
                            href={`/profile`}
                            className="flex items-center w-full"                       >
                        
                            <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        </Link>
                        
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        
                    </DropdownMenuItem> */}

                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <DropdownMenuItem>
                    <SigninButton  />                   
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
