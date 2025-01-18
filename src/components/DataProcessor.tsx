import { useState } from "react";
import { Button } from "./ui/button";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface House {
    streetNumber: string;
    lastName: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    statusAttempt: string;
    consent: string;
    type: string;
    street: string;
}

interface ProcessedData {
    name: string;
    neighborhood: string;
    priorityStatus: number;
    houses: House[];
    streets: string[];
}

type DataProcessorProps = {
    /** 
     * Switches the component between two modes 
     * (for example, "Data Processor" vs "Update Data Processor"). 
     */
    update?: boolean;
};

const DataProcessor: React.FC<DataProcessorProps> = ({ update = false }) => {
    const [inputText, setInputText] = useState('');
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

    // Stubbed-out: define your own create or update functionality
    const createNewSite = () => {
        console.log('Creating new site with processed data:', processedData);
        // TODO[HIGH] Add logic to create a new site
        // ... custom logic here
    };

    const updateSite = () => {
        console.log('Updating site with processed data:', processedData);
        // TODO[HIGH] Add logic to update an existing site
        // ... custom logic here
    };

    const processData = () => {
        const lines = inputText
            .trim()
            .split('\n')
            .filter(line => line.trim());

        const houses: House[] = [];
        const streetsSet = new Set<string>();

        let siteName = '';

        lines.forEach(line => {
            // Handle both tab and pipe delimited data
            const parts = line.includes('|')
                ? line.split('|').filter(part => part.trim())
                : line.split('\t').filter(part => part.trim());

            if (parts.length >= 4) {
                const fullAddress = parts[0].trim();
                const status = parts[1].trim();
                const projectCode = parts[2].trim();
                const consent = parts[3].trim();

                // Extract street number and street name
                const addressMatch = fullAddress.match(/^(\d+)\s+(.+?)\s*$/);

                siteName = projectCode;

                if (addressMatch) {
                    const [, streetNumber, streetName] = addressMatch;

                    streetsSet.add(streetName);

                    let newConsent = '';
                    if (consent === 'Go To   Follow Up') {
                        newConsent = '';
                    } else {
                        newConsent = consent;
                    }

                    houses.push({
                        streetNumber,
                        lastName: '',
                        name: '',
                        phone: '',
                        email: '',
                        notes: '',
                        statusAttempt: status,
                        consent: newConsent,
                        type: '',
                        street: streetName,
                    });
                }
            }
        });

        // Sort houses by street name and street number
        const sortedHouses = houses.sort((a, b) => {
            const streetCompare = a.street.localeCompare(b.street);
            if (streetCompare !== 0) return streetCompare;
            return parseInt(a.streetNumber, 10) - parseInt(b.streetNumber, 10);
        });

        // Sort streets alphabetically
        const sortedStreets = Array.from(streetsSet).sort();

        setProcessedData({
            name: siteName,
            neighborhood: 'n/a',
            priorityStatus: 1,
            houses: sortedHouses,
            streets: sortedStreets,
        });
    };

    const startOver = () => {
        setInputText('');
        setProcessedData(null);
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4">
            <Card>
                {/* 
          Header: Title on the left, 
          and Start Over (destructive button) on the right if data processed.
        */}
                <CardHeader className="w-full flex flex-row justify-between bg-blu items-center">
                    <CardTitle>
                        {/* {update ? 'Update Data Processor' : 'Data Processor'} */}
                        Site Data Manager
                        <CardDescription>{
                            update ?
                                <p>
                                    Copy and paste the data from SF table her to
                                    <span className='font-bold uppercase'>
                                        {' '}update an existing Site
                                    </span>
                                </p>
                                :
                                'Copy and paste the data from SF table here to create a new Site'
                        }
                        </CardDescription>
                    </CardTitle>

                    {processedData && (
                        <Button variant="destructive" onClick={startOver}>
                            <RiDeleteBack2Fill />
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* If data is NOT processed, show the Textarea and "Process Data" button */}
                    {!processedData && (
                        <div className="">
                            <Textarea
                                placeholder="Paste your data here..."
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button onClick={processData}>
                                Process Data
                            </Button>
                        </div>
                    )}

                    {/* If data IS processed, show the results (and hide the Textarea/Process Data) */}
                    {processedData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">{processedData.name}</h3>
                            <div className="mb-4">
                                <h4 className="font-medium">
                                    Houses: {processedData.houses.length}
                                </h4>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-medium">
                                    Found
                                    <span className="text-gray-600 underline m-1">
                                        {processedData.streets.length}
                                    </span>
                                    Streets:
                                </h4>
                                <p className="text-sm">{processedData.streets.join(', ')}</p>
                            </div>

                            {/* 
                Bottom-right corner: 
                Show "Create New Site" or "Update Site" ONLY after data has been processed.
              */}
                            <div className="flex justify-end">
                                {update ? (
                                    <Button onClick={updateSite}>
                                        Update {processedData.name}
                                    </Button>
                                ) : (
                                    <Button onClick={createNewSite}>
                                        Create New Site
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            {processedData && (
                <>
                { JSON.stringify(processedData, null, 2) }
                </>
            )}
        </div>
    );
};

export default DataProcessor;
