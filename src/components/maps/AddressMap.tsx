import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression, LatLngBounds, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface AddressMarkerProps {
    position: [number, number];
    address: string;
}

interface MapProps {
    data: AddressMarkerProps[];
}

const AddressMap: React.FC<MapProps> = ({ data = [] }) => {
    useEffect(() => {
        // Fix for default markers in react-leaflet
        (async function init() {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        })();
    }, []);

    // Default center (approximate center of Ontario) for empty state
    const defaultCenter: LatLngExpression = [49.5, -85];
    let center: LatLngExpression = defaultCenter;
    let zoom =5;

    // Calculate center and bounds if we have data
    if (data.length > 0) {
        // Create bounds object to calculate center and zoom
        const bounds = new L.LatLngBounds(
            data.map(marker => L.latLng(marker.position[0], marker.position[1]))
        );

        // Get center from bounds
        const boundsCenter = bounds.getCenter();
        center = [boundsCenter.lat, boundsCenter.lng];

        // Adjust zoom based on bounds
        if (data.length === 1) {
            zoom = 15; // Closer zoom for single marker
        } else {
            zoom = 13; // Default zoom for multiple markers
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
                        <Marker key={idx} position={marker.position}>
                            <Popup>
                                <p className="font-medium">{marker.address}</p>
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