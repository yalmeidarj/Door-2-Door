
// import fs from 'fs';
import puppeteer from 'puppeteer';
import { SalesForce } from '@/lib/utils';
import { seed } from '../actions/actions';

export default function Page() {
    async function upload(data: FormData) {
        'use server'

        const chosenSite = data.get('site') as string;
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        if (!chosenSite || !username || !password) {
            console.log("Missing credentials");
            return;
        }

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto(SalesForce.URL);

        await page.waitForSelector('input[name="username"]');
        await page.waitForSelector('input[name="pw"]');
        await page.waitForSelector('input[name="Login"]');

        // Type the username and password into the fields
        await page.type('input[name="username"]', username);
        await page.type('input[name="pw"]', password);

        // Click the login button
        await page.click('input[name="Login"]');

        await new Promise((resolve) => setTimeout(resolve, 45000));
        // Wait for the iframe to load


        const frames = await page.frames();
        // console.log(frames);
        console.log(frames.length);

        const iframe = frames[1];

        console.log(frames);
        // Wait for the dropdown to be available and select the option

        const selectElementXPATH =
            "/html/body/div[1]/div[2]/div/div[4]/div[2]/div/div[3]/select"; // The selector for your select element

        

        // const selectTag = await page.$x(selectElement);
        await iframe.$$(SalesForce.selectTagSelector);
        // await iframe.waitForNavigation(SalesForce.selectTagSelector);
        await iframe.select(
            SalesForce.selectTagSelector,
            chosenSite
        );

        await new Promise((resolve) => setTimeout(resolve, 10000));




        const view100RecordsButton = await iframe.waitForSelector(
            "button.btn.btn-default.btn-sm"
        );

        await iframe.evaluate(() => {
            const buttons = Array.from(
                document.querySelectorAll("button.btn.btn-default.btn-sm")
            );
            const targetButton = buttons.find((button) =>
                button.textContent?.includes("100")
            );
            if (targetButton) {
                (targetButton as HTMLButtonElement).click(); // Type assertion
                console.log("100 clicked");
            }
        });

        // Wait for the table to be available
        await iframe.waitForSelector(SalesForce.tableSelector);
        const table = await iframe.$(SalesForce.tableSelector);


        let allData: any[] = [];
        let uniqueStreets = new Set();
        let hasNextPage = true;

        while (hasNextPage) {
            // Wait for the table to be available
            await iframe.waitForSelector(SalesForce.tableSelector);

            const tableData = await iframe.evaluate(() => {
                const rows = Array.from(document.querySelectorAll("tbody.ng-scope tr"));
                return rows.map((row) => {
                    const columns = Array.from(row.querySelectorAll("td")).map(column => column.textContent?.trim() || '');

                    const addressSplit = columns[0].split(' ');
                    const streetNumber = addressSplit[0];
                    const streetName = addressSplit.slice(1).join(' ');

                    const statusAttempt = `${columns[1]} ${columns[3]}`
                    const consent = columns[3] ?? statusAttempt


                    // // Add the street name to the unique streets set
                    // uniqueStreets.add(streetName);

                    return {
                        streetNumber,
                        streetName,                       
                        lastName: "", // You'll need to adjust based on your data
                        name: "", // Adjust as needed
                        phone: "", // Adjust as needed
                        email: "", // Adjust as needed
                        notes: "", // Adjust as needed
                        statusAttempt,
                        consent,
                        type: "", // Adjust as needed
                    };
                });
            });

            // Process and treat the data outside of the evaluate function
            tableData.forEach(item => {
                uniqueStreets.add(item.streetName);
                allData.push({
                    streetNumber: item.streetNumber,
                    lastName: "", // Adjust as needed
                    name: "", // Adjust as needed
                    phone: "", // Adjust as needed
                    email: "", // Adjust as needed
                    notes: "", // Adjust as needed
                    statusAttempt: item.statusAttempt,
                    consent: item.consent,
                    type: "", // Adjust as needed
                    street: item.streetName,
                });
            });



            // Check if the 'Next' button is available and not disabled
            const isNextButtonAvailable = await iframe.evaluate(() => {
                const nextButton = document.querySelector('a[ng-switch-when="next"]');
                return nextButton && !nextButton.classList.contains("ng-hide");
            });

            if (isNextButtonAvailable) {
                // Click the 'Next' button and wait for the new data to load
                await iframe.click('a[ng-switch-when="next"]');
                await iframe.waitForTimeout(5000); // Adjust timeout as necessary
            } else {
                hasNextPage = false;
            }
        }           
               

        // Construct the final object
        const finalObject = {
            name: "ORLNON06_2173A", // Adjust as needed
            neighborhood: "to be verified",
            priorityStatus: 1,
            houses: allData,
            streets: Array.from(uniqueStreets) as string[],
        };

        // // Save the data to a JSON file
        // fs.writeFile('finalData.json', JSON.stringify(finalObject, null, 2), (err) => {
        //     if (err) {
        //         console.error('Error writing file:', err);
        //     } else {
        //         console.log('Data successfully written to file');
        //     }
        // });

        
        // Close the browser
        await browser.close();
        try {
            
            await seed(finalObject);
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
            <form action={test}>

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
                        <option key={key} value={value}>
                            {key}
                        </option>
                    ))}
                </select>

                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >Initiate SalesForce Fetching</button>
            </form>
        </main>
)
}

       




