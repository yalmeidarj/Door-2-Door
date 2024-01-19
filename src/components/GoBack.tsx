import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md'; // Import the chosen icon

export default function GoBack({ href, title }: { href: string, title: string }) {
    return (
        <div className="flex justify-center items-center space-x-2 p-2 max-h-auto rounded-md border-solid border-white border-2  hover:border-blue-400 hover:border-solid hover:border-2  focus:outline-none  focus:ring-blue-500 focus:ring-opacity-50 shadow-md">
            <Link href={href} className="flex items-center text-blue-500 ">
                <MdArrowBack className="text-lg" aria-hidden="true" />
                <span className="text-sm font-bold py-2 px-4 underline" aria-label={`Go back to ${title}`}>{title}</span>
            </Link>
        </div>
    );
}