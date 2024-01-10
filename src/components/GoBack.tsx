import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md'; // Import the chosen icon

export default function GoBack({ href, title }: { href: string, title: string }) {
    return (
        <div className="flex justify-center items-center space-x-2">
            <Link href={href} className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                <MdArrowBack className="text-lg" aria-hidden="true" />
                <span className="text-sm font-bold py-2 px-4 underline" aria-label={`Go back to ${title}`}>{title}</span>
            </Link>
        </div>
    );
}