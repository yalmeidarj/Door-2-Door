'use client'
import { defaultValues } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react"
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function FilterControls() {
    const [viewAll, setViewAll] = useState<string>('false');
    const [currentDisplay, setCurrentDisplay] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const viewAllParam = searchParams.get('viewAll');
        if (viewAllParam === 'true') {
            setViewAll('true');
            setCurrentDisplay(true);
        } else {
            setViewAll('false');
            setCurrentDisplay(false);
        }
    }, [searchParams]);

    const { defaultPage, defaultPerPage } = defaultValues
    const handleViewAll = () => {
        const newViewAll = viewAll === 'true' ? 'false' : 'true';
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('viewAll', newViewAll);
        newSearchParams.set('page', defaultPage.toString());
        newSearchParams.set('per_page', defaultPerPage.toString());
        setViewAll(newViewAll);
        setCurrentDisplay(newViewAll === 'true');
        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    return (
        <div className='flex justify-end'>
            <button
                onClick={handleViewAll}
                className='flex items-center justify-center bg-gray-200 p-2 rounded-lg hover:bg-gray-300'
            >
                {currentDisplay ? <FaEyeSlash /> : <FaEye />}
                <span className='ml-2'>{currentDisplay ? 'Hide consent' : 'View All'}</span>
            </button>
        </div>
    )
}
