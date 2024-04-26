'use client'

import { use, useEffect, useState } from "react";

export default function LocationSelector({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<boolean>(true);
    
    useEffect(() => {
        setActive(true);
    }, []);

    return (
        <div>
            {children}
        </div>
    );
}


    