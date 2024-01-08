


import { SalesForce } from '@/lib/utils';
import { seed } from '../actions/actions';
import SubmitFormButton from '@/components/SubmitFormButton';
// import puppeteerConfig from '@/lib/puppeteerConfig';

export default function Page() {
    async function upload(data: FormData) {
        'use server'

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
        console.log(`${baseURL}/search?chosenSite=${chosenSite}&username=${username}&password=${password}`);
        // send a get request to `${baseURL}/search?chosenSite=${chosenSite}&username=${username}&password=${password}`, expect a long time for the response
        const response = await fetch(`${baseURL}/search?chosenSite=${chosenSite}&username=${username}&password=${password}`, {
            method: 'GET',
        });

        // convert the response to json
        const json = await response.json();



        try {
            console.log(json.data);

            await seed(json.data);
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

       




