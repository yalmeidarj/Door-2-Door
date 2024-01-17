import { SalesForce } from '@/lib/utils';
import { AllLocations, deleteRecords, getActiveLocations, getAllAgents, getAllClockedInAgents, getAllLocationsDropDown, getInactiveLocations, hardDeleteLocation, seed, softDeleteLocation } from '../actions/actions';
import SubmitFormButton from '@/components/SubmitFormButton';
import { FormWrapper } from '@/components/FormWrapper';
import PastShifts from '@/components/PastShifts';
import ClockedInAgents from '@/components/ClockedInAgents';
import { massUpdateStatusAttemptByLocationId } from '@/lib/automations/updateFromAppToSF';
import MassUpdateStatusByLocationForm from '@/components/MassUpdateStatusByLocationForm';
import { initiateSearch, pollJobStatus, handleSearchResults, checkJobStatus } from '@/lib/pupeteerActions';
import HouseRecordsUploader from '@/components/HouseRecordsUploader';
import { getLocationProjectData } from '@/lib/downloadFiles/downloadFilesFromApp';
import { promisify } from 'util';

import fs from 'fs';
import HouseTable from '@/components/HouseTable';


type ProjectData = {
    success: boolean;
    data: {
        name: string;
        neighborhood: string;
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
    async function deleteSiteComplete(data: FormData) {
        'use server'
        // log the chosen site
        const chosenSite = data.get('site') as string;

        const res = await hardDeleteLocation(chosenSite);
        console.log(res);

        return res;
    }

    // const allActiveLocations = await getActiveLocations();
    // const getInactiveLocations = await getInactiveLocations();
    // if ('error' in getInactiveLocations) {
    //     return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error: {allActiveLocations.error}</div>;
    // }

    const allActiveLocations = await getActiveLocations();
    if ('error' in allActiveLocations) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error: {allActiveLocations.error}</div>;
    }

    async function deleteRecordsFromToday(data: FormData) {
        "use server"
        console.log(`Deleting records from today...`);
        // const result = await deleteRecords();
        // return result;
    }

    async function createCsvFile(data: FormData) {
        'use server'
        // log the chosen site
        const chosenSite = data.get('site') as string;
        console.log(chosenSite);
        
        const res = await getLocationProjectData(chosenSite);
        if (res && res.houses) {
            // Assuming res contains an array of houses
            const csvData = res.houses.map(house => ({
                ...house,
                locationName: res.name,
                neighborhood: res.neighborhood,
                priorityStatus: res.priorityStatus
            }));

            const csvString = convertToCSV(csvData);
            await downloadCSV(csvString, "myData.csv");

            // Write to CSV file
            // const writeFileAsync = promisify(fs.writeFile);
            // await writeFileAsync('output.csv', csvString);
            // console.log('CSV file created successfully');

            // Download CSV file
            // const csvString = convertToCSV(



        } else {
            console.log('No data found for the given site');
        }


    }

    return (
        <>
            <div className='flex flex-wrap flex-row gap-0 items-center '>
                <div className='flex flex-col w-full md:w-1/2'>
                    <FormWrapper
                        title='Completely Delete an inactive Site '
                        description='This will delete all data associated with the site. This action cannot be undone. Only inactive sites are shown.'
                    >
                        <form action={deleteSiteComplete}>
                            <div className='flex flex-col'>
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
                            </div>
                            <div className='flex flex-col mt-8'>
                                <SubmitFormButton title={'Hard Delete Location'} />
                            </div>
                        </form>
                    </FormWrapper>
                </div>
                <div className='flex flex-col w-full md:w-1/2'>
                    <FormWrapper
                        title='Delete all records from today'
                        description='This will delete all records from today. This action cannot be undone.'
                    >
                        <form action={deleteRecordsFromToday}>
                            <div className='flex flex-col mt-8'>
                                <SubmitFormButton title={'Delete Records'} />
                            </div>
                        </form>
                    </FormWrapper>
                </div>
                <div className=' '>
                    {/* <form action={createCsvFile}>
                        <div className='flex flex-col'>
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
                        </div>
                        <div className='flex flex-col mt-8'>
                            <SubmitFormButton title={'Get Csv File'} />
                        </div>
                    </form> */}
                </div>

        
            </div>
        </>
    );
}