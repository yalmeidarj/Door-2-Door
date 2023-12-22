import Link from "next/link";

export default function Page() {
    return (
        <div>
        <h1 className="text-2xl font-bold">Forbidden User</h1>
        <p className="text-gray-600">You are not allowed to access this page.</p>
            <p className="text-gray-600">Please, contact your administrator.</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
                <Link href={`/`}>
                    Home
                </Link>
            </button>
        </div>
    );
}
    