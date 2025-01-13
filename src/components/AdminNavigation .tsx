'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsReverseLayoutTextWindowReverse } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';

export default function AdminNavigation({children}: {children?: React.ReactNode}) {
    
    const pathname = usePathname();
    const orgPathName = pathname.split("/")[2];
    

    return (
        
        <div className="w-full flex flex-col  " >
            <div
                // className={`self-end md:pl-14 md:pr-2 pl-4 pr-1 md:max-w-none max-w-xs w-full flex justify-end items-center mt-4 max-w-auto`}
                className={`w-full bg-night text-slate-100 p-2  rounded shadow items-center justify-center flex mt-4 max-w-auto`}
            >
            <Link
                href={`/org/${orgPathName}/admin`}
                className={`flex items-center justify-center gap-2 px-6 py-0.5 ${pathname === '/org/admin' ? 'bg-white' : 'bg-night'
                    } rounded-t-lg`}
            >
                <BsReverseLayoutTextWindowReverse className="w-4 h-4" />
                <span className="hidden sm:inline">App Management</span>
                    <span className="sm:hidden">App</span>
            </Link>
            <Link
                href={`/org/${orgPathName}/admin/user`}
                className={`flex items-center justify-center gap-2 px-6 py-0.5 ${pathname === '/org/admin/user' ? 'bg-white' : 'bg-night'
                    } rounded-t-lg`}
            >
                <FaUserAlt className="w-4 h-4" />
                <span className="hidden sm:inline">User Management</span>
                <span className="sm:hidden">Users</span>
            </Link>

            </div>
            <div className='w-full    rounded-sm'>            
            {children}
            </div>
        </div>
    );
};

