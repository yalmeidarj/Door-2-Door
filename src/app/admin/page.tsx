import { AllLocations, getActiveLocations, getAllAgents, getAllClockedInAgents, getAllLocationsDropDown, getUserById, seed, softDeleteLocation } from '../actions/actions';
import SubmitFormButton from '@/components/SubmitFormButton';
import { FormWrapper } from '@/components/FormWrapper';
import ClockedInAgents from '@/components/ClockedInAgents';
import { massUpdateStatusAttemptByLocationId } from '@/lib/automations/updateFromAppToSF';
import MassUpdateStatusByLocationForm from '@/components/MassUpdateStatusByLocationForm';
import { initiateSearch, pollJobStatus, handleSearchResults, checkJobStatus } from '@/lib/pupeteerActions';
import HouseRecordsUploader from '@/components/HouseRecordsUploader';

import PastShiftsByAgentId from '@/components/PastShiftsByAgentId';
import HouseManager from '@/components/houseManager/HouseManager';

import { getServerSession } from 'next-auth';
import { authOptions } from "@/server/auth";
import Link from 'next/link';


type ProjectData = {
    success: boolean;
    data: {
        name: string;
        neighborhood: string ;
        priorityStatus: number;
        houses: House[];
        streets: string[];
    };
};

type House = {
    streetNumber: number;
    lastName: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    statusAttempt: string;
    consent: string;
    type: string;
    street: string;
};

export default async function Page() {
    // Create a timeout promise
    function timeout(ms: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, ms);
        });
    }

    async function deleteSite(data: FormData) {
        'use server'
        // log the chosen site
        const chosenSite = data.get('site') as string;

        const res = await softDeleteLocation(chosenSite);
        console.log(res);

        return res;
    }

    const upload = async (data: FormData) => {
        "use server"
        // event.preventDefault();

        // const formData = new FormData(event.target);
        const chosenSite = data.get('site') as string;
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        if (!chosenSite || !username || !password) {
            console.log("Missing credentials");
            return;
        }

        console.log('Initiating search...');
        const jobId = await initiateSearch(chosenSite, username, password);

        if (jobId) {
            pollJobStatus(jobId, (status: any) => {
                handleSearchResults(status);
                // Additional code to update UI based on the status
            });
        } else {
            console.log('Error initiating search');
        }
    };


    // const checkJobs = await checkJobStatus();   


    const allClockedInAgents = await getAllClockedInAgents()
    const allActiveLocations = await getActiveLocations();
    const allAgents = await getAllAgents()

    if ('error' in allActiveLocations) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error: {allActiveLocations.error}</div>;
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You are not logged in</p>
                </div>
            </div>
        );
    }

    const user = await getUserById(session.user.id);

    if (!user || 'error' in user) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error</div>;
    }

    console.log(`USER ID: ${session.user.id}`)
    if (user.role !== 'ADMIN') {
        console.log(`USER OBJECT: ${user.role}`);
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You are not authorized to view this page</p>
                </div>
            </div>
        );
    }
    

        return (
            <main className="p-6 mx-auto max-w-5xl flex flex-col">
                {/* <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Houses Table</h1>
            <HouseTable /> */}
                {/* <FinishedShiftsByLocal /> */}
                <div className='flex flex-row flex-wrap gap-3 max-w-full mx-auto'>
                    <Link
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        href="/seeding"
                    >   View houses not updated in SalesForce
                        
                    </Link>
                    </div>
                <div className="flex flex-row flex-wrap gap-3 justify-between mb-4">
                    {/* <FormWrapper
                    title="Fetch Salesforce"
                    description="Use this form to fetch a site from Salesforce"
                >
                    <form className="mt-6 max-w-md flex flex-col gap-4" action={upload}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">SALESFORCE Username:</label>
                            <input
                                required
                                type="text" id="username" name="username"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md hover:border-indigo-300" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">SALESFORCE Password:</label>
                            <input
                                required
                                type="password" id="password" name="password"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md hover:border-indigo-300" />
                        </div>                        
                        <div>
                            <label htmlFor="site" className="block text-sm font-medium text-gray-700">Choose a site:</label>
                            <select
                                required
                                name="site" id="site"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value=""></option>
                                {Object.entries(SalesForce.siteOptions).map(([key, value]) => (
                                    <option key={value} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <SubmitFormButton title="Initiate SF Fetching" />
                    </form>
                </FormWrapper > */}

                    <FormWrapper
                        title="Delete Site"
                        description="Use this form to delete a site"
                    >
                        <form action={deleteSite}>
                            <div className='flex flex-col gap-4'>
                                <label htmlFor="site" className="block text-sm font-medium text-gray-700">Choose a site:</label>
                                <select
                                    required
                                    name="site" id="site"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value=""></option>
                                    {allActiveLocations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                                <SubmitFormButton title="Delete site" />
                            </div>
                        </form>
                    </FormWrapper >

                    <MassUpdateStatusByLocationForm
                        data={allActiveLocations}
                    />
                </div>
                {/* <div className='flex flex-row flex-wrap gap-3 max-w-full mx-auto px-6'>
                <PastShifts
                    agents={allAgents}
                />

            </div> */}
                {/* <div className='flex flex-row flex-wrap max-w-full mx-auto'>
            </div> */}
                <div className='flex flex-col sm:flex sm:flex-row flex-wrap min-w-full mx-auto border-gray-400 border rounded-sm'>
                    <PastShiftsByAgentId />
                </div>
                <div className='flex flex-col sm:flex sm:flex-row flex-wrap min-w-full mx-auto border-gray-400 border rounded-sm'>
                    <ClockedInAgents />
                </div>
                <HouseRecordsUploader />
                <div className=' '>
                    <HouseManager />
                </div>
            
            </main>

        );

    }





