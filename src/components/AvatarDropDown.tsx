import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import {
    LogOut,
    Mail,
    Settings,
    User,
} from "lucide-react"
import { Link } from "react-router"

const AvatarDropDown = () => {

    const { logout, userPath } = useAuth();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="/user.png" alt="profile-icon" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User />
                        <Link to={`/${userPath}`}>
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Mail />
                        <Link to={`/${userPath}/messages`}>
                            <span>Messages</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LogOut />
                        <span onClick={() => logout()}>
                            <span>Log Out</span>
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <Link to={`/${userPath}/settings`}>
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default AvatarDropDown;