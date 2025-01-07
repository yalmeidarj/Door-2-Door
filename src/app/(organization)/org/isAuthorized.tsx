"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useState, useEffect } from "react";
import Image from "next/image";
import { createNavItems } from "@/components/navbar/nav-items";
import { Button } from "@/components/ui/button";

export default function Authorized(
    { id, secret, orgName, children }: { id: string; secret: string; orgName: string; children?: React.ReactNode }
) {    
    const userId = id as Id<"users">;
    const pathname = usePathname()


    
    const user = useQuery(api.authAdapter.getUser, {
        id: userId,
        secret: secret,
    });
    
    const organization = useQuery(api.organization.getOrgByName, {
        name: orgName
    })
    if (!organization) {
        return (
            <>                
            <OrgNotFound />
            </>
        );
    }
    if (!user) {
        return <div>No User Found...</div>;
    }
    if (!user.organizationId || organization._id !== user.organizationId){
        return <UserNotInOrg
            email={user.email}
            userId={user._id}
            userName={user.name}
            orgId={organization._id}
        />
    }
    return (
        <div className=" w-full ">
            <ShortSideBar
                orgName={orgName}
            />
            <MobileSideBar
                orgName={orgName}
                />
            <div className='md:mb-2 mb-[4rem]'>            
            </div>
            <div className='w-full '>            
                {children}
            </div>
        </div>
    );
}


// helper components

function OrgNotFound() {
    return (
        <div>
            <h1>No Organization Found...</h1>
        </div>
    )
}

const UserNotInOrg = ({ email, userId, orgId, userName }: {
    email?: string,
    userId?: string,
    orgId?: string
    userName?: string,
}) => {
    const requestAccess = useMutation(api.orgAccessRequest.createNewOrgAccessRequest)
    const existingRequests = useQuery(api.orgAccessRequest.getRequestByUserId, {
        id: userId as Id<"users">,
        orgId: orgId as Id<"organization">
    })
    if (existingRequests) {
        return (
        < div className = "w-full h-screen flex flex-col items-center justify-center" >
            <h1 className="text-2xl font-bold">You have no access to this organization</h1>
            <p className="text-gray-600">
                A request has already been sent asking for access to
                <span className="font-semibold mx-2">
                    {email ? email : "this email"}
                    </span>
                </p>
            </div>
        );   
    }    
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">You have no access to this organization</h1>
            <p className="text-gray-600">
                Please, contact your administrator and request access to
                <span className="font-semibold mx-2">
                    {email ? email : "this email"}
                </span>                   
                    <Button
                    variant="ghost"
                    onClick={() => requestAccess({
                        orgId: orgId as Id<"organization">,
                        userId: userId as Id<"users">,
                        email: email,
                        userName: userName
                    })}
                        >
                    Send
                </Button>
                
            </p>
        </div>
    );
};

interface MobileSideBarProps {
    orgName: string; 
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ orgName }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            // User is scrolling down
            setIsVisible(false);
        } else {
            // User is scrolling up
            setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className="text-xl fixed top-0 left-0 w-full bg-night text-white shadow-md md:hidden">
            <div className="flex items-center justify-between p-4">
                <div className="logo">
                    <Link
                        href={`/org/${orgName}`}
                        aria-label="Logo"
                    >
                        <h1 className="text-2xl text-white font-bold">
                            {orgName.toUpperCase()}
                        </h1>
                    </Link>
                </div>
                <SidebarTrigger />
            </div>
        </div>
    );
};

function ShortSideBar({ orgName }: { orgName: string }) {

    const navItems = createNavItems(orgName);
    return (
        <>
            <div className="fixed top-0 bottom-0 flex flex-col justify-between h-screen p-2 pt-3 items-center left-0 bg-night text-white w-12 invisible md:visible z-50">
                <div className='flex flex-col items-center gap-4 text-xl'>
                    <SidebarTrigger />
                    {navItems.header.map((item) => (
                        <Link
                            key={item.name}
                            href={item.link}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>
                <div className='flex flex-col justify-between items-center gap-4 p-3'>
                    {navItems.footer.map((item) => (
                        <Link
                            key={item.name}
                            href={item.link}
                        >
                            {item.icon}
                        </Link>
                    ))}
                    <Link
                        href={navItems.user.link}
                    >
                        {navItems.user.icon}
                    </Link>
                </div>
            </div>
        </>
    )
}