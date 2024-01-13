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

export async function initiateSearch(chosenSite: string, username: string, password: string) {
    
    const URL = process.env.PUPPETEER_API_URL;
  try {
    const response = await fetch(
      `${URL}/search?chosenSite=${chosenSite}&username=${username}&password=${password}`
    );
    const data = await response.json();

    if (data.success) {
      return data.jobId;
    } else {
      console.error("Error initiating search:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

export async function checkJobStatus(jobId: string) {
  try {
    const response = await fetch(`/job/${jobId}`);
    return await response.json();
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

export function pollJobStatus(jobId:string, callback:any, interval = 3000) {
  const poll = async () => {
    const status = await checkJobStatus(jobId);
    if (status && (status.state === "completed" || status.state === "failed")) {
      callback(status);
    } else {
      setTimeout(poll, interval);
    }
  };

  poll();
}

export function handleSearchResults(status: any) {
  if (status.state === "completed") {
    // Display the results
    console.log("Search results:", status.result);
  } else if (status.state === "failed") {
    // Handle failed search
    console.error("Search failed:", status.reason);
  }
}

// Example usage
// const chosenSite = "example.com";
// const username = "user123";
// const password = "secret";

// initiateSearch(chosenSite, username, password).then((jobId) => {
//   if (jobId) {
//     pollJobStatus(jobId, handleSearchResults);
//   }
// });
