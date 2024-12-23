import Link from "next/link";
import { FaGreaterThan } from "react-icons/fa6";
import { Separator } from "./ui/separator";
import ShiftHandler from "./ShiftHandler";
import { auth } from "@/auth";

type PageHeaderProps = {
    routes?: Array<{
        name: string;
        link?: string;
    }>;
};

export default async function PageHeader({ routes = [] }: PageHeaderProps) {
    const session = await auth();

    if (!session || !session.user) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">You are not logged in.</h1>
                <p className="text-gray-600">Please, sign in to access this page.</p>
            </div>
        );
    }
    const user = session.user;

    return (
        <div className="w-full ">
            <div className="flex justify-between h-9 items-center md:pl-14 md:pr-8 pl-4 pr-1 mx-auto">
                <div className="flex items-center gap-1 mb-1 text-gray-500">
                    {routes.map((route, index) => (
                        <div className="flex items-center" key={index}>
                            {index > 0 && (
                                <FaGreaterThan className="text-xs mx-2 text-gray-400" />
                            )}
                            {route.link ? (
                                <Link href={route.link} className="text-sm font-bold hover:text-gray-700">
                                    {route.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-bold">{route.name}</span>
                            )}
                        </div>
                    ))}
                </div>
                {/* <Separator
                    className=""
                    orientation="vertical"
                /> */}
                <ShiftHandler
                    userId={user.id as string}
                />
            </div>
            <Separator className="w-full" />
        </div>
    );
}