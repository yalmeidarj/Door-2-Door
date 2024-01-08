import { SalesForce } from '@/lib/utils';
import { seed } from '../actions/actions';
import SubmitFormButton from '@/components/SubmitFormButton';

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
};

export default function Page() {
    // Create a timeout promise
    function timeout(ms: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, ms);
        });
    }

    async function upload(data: FormData) {
        'use server'
        console.log('uploading, this may take a while...');

        const chosenSite = data.get('site') as string;
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        const baseURL = SalesForce.puppeterApi.url
        // const chosenSiteName = SalesForce.puppeterApi.sites[chosenSite]



        if (!chosenSite || !username || !password) {
            console.log("Missing credentials");
            return;
        }

        console.log(chosenSite);
        console.log(username);
        console.log(password);
        const URL = `${baseURL}/search?chosenSite=${chosenSite}&username=${username}&password=${password}`;

        const response: ProjectData = await fetch(URL)
            .then((response) => response.json());
        

        if (!response  ) {
            console.log('no response');
            return;
        }


        try {
            console.log(response.data);

            await seed(response.data);
                
        }
        catch (err) {
            console.log(err);
            console.log('error seeding');
        }
        
    }


    async function test(data: FormData) {
        'use server'
        // log the chosen site
        const chosenSite = data.get('site');
        // log the username
        const username = data.get('username');

        // log the password
        const password = data.get('password');
        // toast.success("Client action");

        console.log(chosenSite);
        console.log(username);
        console.log(password);

        

    }

    return (
        <main>
            <h1>React Server Component: Upload</h1>
            <form action={upload}>

                {/* Create credentials input fields */}
                <label htmlFor="username">SALESFORCE Username:</label>
                <input
                    required
                    type="text" id="username" name="username" />

                <label htmlFor="password">SALESFORCE Password:</label>
                <input
                    required
                    type="password" id="password" name="password" />

                

                {/* Create a dropdown menu with siteOptions */}
                <label htmlFor="site">Choose a site:</label>
                <select
                    required
                    name="site" id="site">
                    <option  value="">
                        
                    </option>
                    {Object.entries(SalesForce.siteOptions).map(([key, value]) => (
                        <option key={value} value={key}>
                            {key}
                        </option>
                    ))}
                </select>

                <SubmitFormButton title="Initiate SF Fetching" />
            </form>
        </main>
)
}

       




