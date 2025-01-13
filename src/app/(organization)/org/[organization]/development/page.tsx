"use client"

import AddressGeocoder from "@/components/AddressGeocoder"

export default function Page() {
    // const Geocodio = require('geocodio-library-node');
    // const geocoder = new Geocodio('YOUR_API_KEY');

    // const addresses = [
    //     '1109 N Highland St, Arlington VA',
    //     '525 University Ave, Toronto, ON, Canada',
    //     '4410 S Highway 17 92, Casselberry FL',
    //     '15000 NE 24th Street, Redmond WA',
    //     '17015 Walnut Grove Drive, Morgan Hill CA'
    // ];

    // geocoder.geocode(addresses)
    //     .then(response => {
    //         console.log(response);
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     }
    //     );


    return (
        <div className="w-full h-full">
            <div className="container  ">
                <h1 className="text-2xl font-bold text-center my-8">
                Batch Address Geocoder
            </h1>
                <AddressGeocoder  />
            </div>
        </div>
    )
}