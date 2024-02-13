"use client"
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Popup } from 'react-leaflet/Popup'
import { Marker } from 'react-leaflet/Marker'
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { CiFlag1 } from "react-icons/ci";

// Define the type for a single location
interface Location {
    lat: number;
    lng: number;
    name?: string; // Optional name property for popup content
}

// Define the props for MapWithMarkers component
interface MapWithMarkersProps {
    locations: Location[];
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ locations }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const markers = L.markerClusterGroup();
        locations.forEach((location) => {
            const marker = L.marker([location.lat, location.lng]);

            // Check if the location has a name, and if so, add a popup to the marker
            if (location.name) {
                marker.bindPopup(location.name);
            }

            markers.addLayer(marker);
        });

        map.addLayer(markers);

        return () => {
            map.removeLayer(markers);
        };
    }, [map, locations]);

    return null;
};

const LeafletMap: React.FC = () => {
    const locations: Location[] = [
        { lat: 43.8109, lng: -79.4262, name: 'Location 1' },
        { lat: 43.8106, lng: -79.4263, name: 'Location 2' },
        { lat: 43.8105, lng: -79.4260, name: 'Location 3' },
        { lat: 43.8103, lng: -79.4262, name: 'Location 4' },
        { lat: 43.8109, lng: -79.4262, name: 'Location 5' },
        { lat: 43.8109, lng: -79.4264, name: 'Location 6' }
    ];

    return (
        <div className='items-center p-8 h-[600px] w-[600px]'>
            <MapContainer center={[43.8109, -79.4262]} zoom={100} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                
                />
                {/* <MapWithMarkers locations={locations} /> */}
                {locations.map((location, index) => (
                    <Marker
                        icon={L.icon({
                            iconUrl: '/R.png',
                            iconSize: [20, 20],
                            className: 'bg-yellow-300 rounded-full',
                            // className: 'bg-green-300 rounded-full',
                            // iconAnchor: [20, 40]
                        })}
                        key={index}
                        position={[location.lat, location.lng]}
                    >
                        <CiFlag1 />
                        {location.name && <Popup>{location.name}</Popup>}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
