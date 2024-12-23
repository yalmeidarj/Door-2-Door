// contexts/OrganizationContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';


interface OrganizationContextType {
    organizationId: string | null | undefined;
    isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType>({
    organizationId: null,
    isLoading: true
});

interface OrganizationProviderProps {
    children: React.ReactNode;
    userId: string;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
    children,
    userId
}) => {
    const organization = useQuery(api.users.getOrgByUserId , {
        id: userId as Id<'users'>
    })

        // id: userId as Id<'users'>
        // id:"jh7exyx5cbv8d6a1hp2sc9cv6573wkes"

    
        
    console.log("ORGANIZATION", organization)    
        
    if (!organization) {
         
        return (
            <div className="container bg-gray-100 shadow-md rounded-lg p-4 md:p-6 lg:p-8 space-y-4">
                <h3 className="font-medium text-base text-gray-800">No Organization</h3>
                <p className="text-sm text-gray-600">You are not part of any organization.</p>
            </div>
        )
    }

    const orgId = organization._id

    return (
        <OrganizationContext.Provider
            value={{
                organizationId: orgId,
                isLoading: organization === undefined
            }}
        >          

            <div key={orgId}>
                <h3 className="font-medium text-base text-gray-800">Organization</h3>
                <p className="text-sm text-gray-600">{organization.name || 'No name'}</p>
            </div>

            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganization = () => {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
};