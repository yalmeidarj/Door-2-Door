"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { LocationType } from '@/lib/sites/types';
import { StreetType } from '@/lib/streets/types';
import { HouseType } from '@/lib/houses/types'; 
import {
    // getLocations,
    getStreetsInLocation,
    createHouse,
    updateHouse,
    deleteHouse,
    getHousesInStreet
} from '@/lib/houseManager/helperFunctions';
import { getLocations} from '@/lib/sites/helperFunctions';
import { DivOverlay } from 'leaflet';


export default function HouseManager() {
    const [locations, setLocations] = useState<LocationType[]>([]);
    const [streets, setStreets] = useState<StreetType[]>([]);
    const [houses, setHouses] = useState<HouseType[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<number>(0);
    const [selectedStreet, setSelectedStreet] = useState<number>(0);
    const [selectedHouse, setSelectedHouse] = useState<number>(0);


    return (
        <div className="flex flex-col">
            HouseManager
            </div>
    )
}
