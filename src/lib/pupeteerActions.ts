import { SalesForce } from "./utils";

export async function loginToSF(page: any, username:string, password:string) {
    try {
                    // Wait for the username and password fields and login button to be available
            await page.waitForSelector('input[name="username"]');
            await page.waitForSelector('input[name="pw"]');
            await page.waitForSelector('input[name="Login"]');

            // Type the username and password into the fields
            await page.type('input[name="username"]', username);
            await page.type('input[name="pw"]', password);

            // Click the login button
        await page.click('input[name="Login"]');
        
        return {
            status: "success",
            message: "Logged in successfully"
        }
    } catch (error) {
        console.error(error);
    }

}