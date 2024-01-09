export default function Page() {
    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Platform User Guide</h1>

            <section className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
                <h2 className="text-xl font-semibold mb-2">Important Notes</h2>
                <ul className="list-disc pl-6 mb-3">
                    <li><strong>SalesForce Notes:</strong> Please ensure that all entries in this section are relevant and precise as they are directly sent to Salesforce.</li>
                    <li><strong>Internal Notes:</strong> These notes are for internal team reference and do not get sent to Salesforce.</li>
                    <li><strong>House Status:</strong> Accurately update the status of each house visit, including door knock attempts and other significant statuses like 'Consent Final Yes/No', 'Engineer Visit Required', etc.</li>
                </ul>
                <p>Accuracy in data entry is crucial for the effectiveness of our operations. If there are any questions or clarifications needed regarding this guide, please feel free to reach out.</p>
            </section>

            <section className="mb-5">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Login and Main Page Navigation</h2>
                <p className="text-gray-600 mb-2"><strong>Login:</strong> If you are not logged in, the platform will redirect you to the login page.</p>
                <p className="text-gray-600"><strong>Home Page:</strong> Once logged in, you will be taken to the home page which displays a list of neighborhood locations where our construction projects are active.</p>
            </section>

            <section className="mb-5">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Location, Street, and House Details</h2>
                <p className="text-gray-600">From the main page, you can select a location to view the streets involved in our project. By selecting a street, you will be able to access a list of houses on that street.</p>
            </section>

            <section className="mb-5">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Updating House Information</h2>
                <p className="text-gray-600 mb-2"><strong>Accessing House Details:</strong> Click on a house to view and edit its details. Note that the edit option is available only when you are clocked in.</p>
                <p className="text-gray-600 mb-2"><strong>Edit Form:</strong> The form includes fields for construction type, Salesforce notes, user details, internal notes, and house status. The construction type indicates the difficulty level of accessing the house. Salesforce notes are critical for communication with the sales team and should be filled in accurately.</p>
                <p className="text-gray-600"><strong>Submit Updates:</strong> After completing the form, click submit to update the house details.</p>
            </section>

            <section className="mb-5">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Work Shift Tracking and Statistics</h2>
                <p className="text-gray-600 mb-2"><strong>Pace and PaceFinal:</strong> These metrics indicate the number of houses visited in a work shift, and how many of these visits received a homeowner response, respectively.</p>
                <p className="text-gray-600 mb-2"><strong>Recording Work Shifts:</strong> Your work shift details, including clock-in and clock-out times, location, pace, and PaceFinal, are automatically recorded in the system.</p>
                <p className="text-gray-600 mb-2"><strong>Profile Page:</strong> Your personal work shift history can be viewed on your profile page.</p>
                <p className="text-gray-600"><strong>Site Information Page:</strong> This page provides statistics on the overall project, including the number of houses visited, responses received, and pending visits.</p>
            </section>
        </div>
    );
}
