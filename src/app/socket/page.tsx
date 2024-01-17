"use client"
import { FormWrapper } from '@/components/FormWrapper';
import SubmitFormButton from '@/components/SubmitFormButton';
import { SalesForce } from '@/lib/utils';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { seed } from '../actions/actions';
import HouseRecordsUploader from '@/components/HouseRecordsUploader';
import toast from 'react-hot-toast';
import Spinner from '@/components/Spinner';
import { set } from 'date-fns';

type ProjectData =
    // {
    // // success: boolean;
    // data: 
    {
        name: string;
        neighborhood: string;
        priorityStatus: number;
        houses: House[];
        streets: string[];
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


export default function Page() {
    const [socket, setSocket] = useState<any>(undefined);
    const [downloadData, setDownloadData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    

    const downloadJSON = (data: ProjectData, filename:string) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a link element, use it to download the file and remove it
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    //rYeEsydWN!8808168eXkA9gV47A
    useEffect(() => {
        // const socketUrl = process.env.REACT_APP_SOCKET_URL || 'https://tdxpuppeteernodeweb.onrender.com';
        // if in production, use the production url, otherwise use the local url
        const socketUrl = process.env.NODE_ENV === 'production' ? 'https://tdxpuppeteernodeweb.onrender.com' : 'http://localhost:7000';
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('botResponse', (response) => {
            setIsLoading(false); // Stop loading when response is received
            if (response.success) {
                console.log("Success!");
                
                console.log("Success!");
                
                setDownloadData(response.data);

            } else {
                console.error(response.error);
                // Handle error
            }
        });

        newSocket.on('AllTableData', (response) => {
            setIsLoading(false); // Stop loading when response is received
            if (response.success) {
                console.log("Success!");
                
                console.log("Success!");
                
                setDownloadData(response.data);

            } else {
                console.error(response.error);
                // Handle error
            }
        });

        // return () => newSocket.disconnect();
    }, []);
    
    
    async function upload(data: FormData) {
        
        console.log('uploading, this may take a while...');

        const payload = {
        chosenSite: data.get('site') as string,
            username: data.get('username') as string,
            password: data.get('password') as string,
        }
        
        toast.success("Fetching data from Salesforce, this may take a while...");

        setIsLoading(true); // Start loading when emitting the event
        socket.emit('getConsentFinal', payload);       

    }
    
    return (
        <div>
            {isLoading ? (
                // Display Spinner when loading
                <div className="flex flex-col justify-center items-center">
                    <Spinner />
                    <h1 className="text-md font-semibold text-gray-700">Fetching data from Salesforce...</h1>
                    <h2 className="text-xs font-semibold text-gray-700">This may take a while, please, do not reload the page</h2>
                </div>
            ) : (
                <div className="flex flex-row flex-wrap gap-3 justify-center">
                    <FormWrapper
                        title="Fetch Salesforce"
                        description="Use this form to fetch a site from Salesforce"
                    >
                        <form className="mt-6 max-w-md flex flex-col gap-4" action={upload}>
                            {/* Create credentials input fields */}
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

                            {/* Create a dropdown menu with siteOptions */}
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
                    </FormWrapper >
                    {downloadData && (
                        // <div>
                        // </div>
                        <div className='max-w-[400px] '>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => downloadJSON(downloadData, `${downloadData.name}.json`)}>
                                Download JSON
                            </button>
                            <HouseRecordsUploader  />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
    