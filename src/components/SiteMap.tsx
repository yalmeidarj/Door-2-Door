"use client"
import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Import the MarkerClusterer constructor from the library
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export default function SiteMap() {
    const mapRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
                version: 'weekly',
                libraries: ["places"], // Ensure the "places" library is loaded if needed
            });

            loader.load().then((google) => {
                const map = new google.maps.Map(mapRef.current as HTMLElement, {
                    center: { lat: 43.8109, lng: -79.4262 },
                    zoom: 20,
                    mapId: 'MY_NEXT_MAPSID',
                });

                // Define your locations array here
                const locations = [
                    { lat: 43.8109, lng: -79.4262 },
                    { lat: 43.8106, lng: -79.4263 },
                    { lat: 43.8105, lng: -79.4260 },
                    { lat: 43.8103, lng: -79.4262 },
                    { lat: 43.8109, lng: -79.4262 },
                    { lat: 43.8109, lng: -79.4264 }
                ];

                // Create markers
                const markers = locations.map(location => new google.maps.Marker({ position: location }));

                // Now, use MarkerClusterer as intended
                new MarkerClusterer({ map, markers });
            });
        }

        initMap();
    }
    , []);

    return (
        <div className='items-center p-8 h-[600px] w-[600px]'
            ref={mapRef}
        >
            
            </div>
        
         
    );
}
