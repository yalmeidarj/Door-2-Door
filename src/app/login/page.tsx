import SignIn from "@/components/auth-components/SignIn";

export default async function Page() {

    return (
        <div className="w-full">
            <div className="container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                        <div className="p-8 sm:p-12">
                        <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Door 2 Door</h1>
                            <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-8">
                            Welcome Back
                            </h2>
                        <SignIn />
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
