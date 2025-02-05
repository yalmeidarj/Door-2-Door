import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface AddressMarkerProps {
    position: [number, number];
    address: string;
    statusAttempt?: string;
}

interface MapProps {
    data: AddressMarkerProps[];
}

const AddressMap: React.FC<MapProps> = ({ data = [] }) => {
    // Function to determine marker color based on status
    const getMarkerColor = (status?: string): string => {
        switch (status) {
            case 'Consent Final Yes':
                return '#16a34a'; // Tailwind green-600
            case 'Drop Type Unverified':
                return '#fde047'; // Tailwind green-600
            case 'Consent Final No':
                return '#dc2626'; // Tailwind red-600
            case 'Home Does Not Exist':
                return '#374151'; // Tailwind gray-600
            case 'No Attempt':
                return '#64748b'; // Tailwind slate-600
            case 'Door Knock Attempt 1':
                return '#3b82f6'; // Tailwind blue-600
            case 'Door Knock Attempt 2':
                return '#3b82f6'; // Tailwind blue-600
            case 'Door Knock Attempt 3':
                return '#3b82f6'; // Tailwind blue-600
            case 'Door Knock Attempt 4':
                return '#3b82f6'; // Tailwind blue-600
            case 'Door Knock Attempt 5':
                return '#3b82f6'; // Tailwind blue-600
            case 'Door Knock Attempt 6':
                return '#3b82f6'; // Tailwind blue-600
            default:
                return '#64748b'; // Tailwind slate-600
        }
    };

    // Create custom icon function
    const createCustomIcon = (status?: string) => {
        const color = getMarkerColor(status);
        const iconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <path d="M12 0C7.58 0 4 3.58 4 8c0 5.52 8 14.94 8 14.94s8-9.42 8-14.94c0-4.42-3.58-8-8-8z" fill="${color}" />
            <circle cx="12" cy="8" r="4" fill="white" />
        </svg>
    `;

        return new L.Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(iconSVG)}`,
            iconSize: [32, 32], // Icon size
            iconAnchor: [16, 32], // Anchor point for the pin tip
            popupAnchor: [0, -32], // Popup position relative to the marker
        });
    };


    // Default center (approximate center of Ontario) for empty state
    const defaultCenter: LatLngExpression = [49.5, -85];
    let center: LatLngExpression = defaultCenter;
    let zoom = 5;

    // Calculate center and bounds if we have data
    if (data.length > 0) {
        const bounds = new L.LatLngBounds(
            data.map(marker => L.latLng(marker.position[0], marker.position[1]))
        );

        const boundsCenter = bounds.getCenter();
        center = [boundsCenter.lat, boundsCenter.lng];

        if (data.length === 1) {
            zoom = 15;
        } else {
            zoom = 20;
        }
    }

    // Validate coordinates before rendering
    const validMarkers = data.filter(marker =>
        !isNaN(marker.position[0]) &&
        !isNaN(marker.position[1]) &&
        marker.position[0] >= -90 &&
        marker.position[0] <= 90 &&
        marker.position[1] >= -180 &&
        marker.position[1] <= 180
    );

    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 z-0">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {validMarkers.map((marker, idx) => (
                        <Marker
                            key={idx}
                            position={marker.position}
                            icon={createCustomIcon(marker.statusAttempt)}
                        >
                            <Popup>
                                <p className="font-medium">{marker.address}</p>
                                {marker.statusAttempt && (
                                    <p className="text-sm text-gray-600">{marker.statusAttempt}</p>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            {validMarkers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <p className="text-lg text-muted-foreground">
                        {data.length === 0 ? "No houses to display" : "Invalid coordinates provided"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddressMap;