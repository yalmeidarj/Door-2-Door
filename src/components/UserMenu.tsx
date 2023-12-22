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
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SigninButton from "./SigninButton"

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
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <DropdownMenuItem>
                    <SigninButton  />                   
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
