export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <h3 className="text-2xl font-bold text-center">Login to your account</h3>
                    <div className="mt-4">
                        <div className="flex items-center justify-between mt-4">
                            {/* <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-900 focus:outline-none focus:bg-blue-900">
                                Login
                            </button> */}
                            <button type="button"  className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-red-600 rounded-md hover:bg-red-900 focus:outline-none focus:bg-red-900">
                                Login with Google
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
}