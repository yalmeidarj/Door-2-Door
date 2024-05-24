"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { defaultValues } from '@/lib/utils';

type PaginationControlsProps = {
    state: {
        perPage: number;
        currentPage: number;
    };
    data: {
        totalRecords: number;
        hasNextPage: boolean;
        totalPages: number
    }
}

type Props = {
    metadata: PaginationControlsProps;
}

export function PaginationControls({ metadata }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { perPage } = metadata.state;
    const { totalPages } = metadata.data;
    const { defaultPerPage } = defaultValues;

    const [localPerPage, setLocalPerPage] = useState(perPage);
    const [currentPage, setCurrentPage] = useState(metadata.state.currentPage);

    useEffect(() => {
        setLocalPerPage(perPage);
    }, [perPage]);

    useEffect(() => {
        const pageParam = searchParams.get('page');
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        setCurrentPage(page);
    }, [searchParams]);

    const changePage = (newPage: number, newPerPage?: number) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', newPage.toString());
        newSearchParams.set('per_page', newPerPage ? newPerPage.toString() : perPage.toString());
        router.push(`${pathname}?${newSearchParams}`);
    };

    const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = parseInt(event.target.value, 10);
        setLocalPerPage(newPerPage);
        changePage(1, newPerPage); // Reset to page 1 with new per_page value
    };

    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`px-2 py-1 border border-gray-400 rounded text-sm 
                                hover:bg-gray-200 hover:text-black 
                                focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50 
                                transition ease-in duration-150 
                                ${i === currentPage ? 'bg-gray-500 text-white' : 'bg-white text-gray-800'}`}
                    onClick={() => changePage(i)}
                    disabled={i === currentPage}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex flex-col justify-center items-center space-x-2 py-2">
            <div className='flex justify-end w-full items-center'>
                <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
            </div>

            <div className='flex justify-between items-center space-x-1'>
                <button
                    className="px-2 py-1 border border-gray-400 rounded text-sm 
                           hover:bg-gray-200 hover:text-black 
                           focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50 
                           transition ease-in duration-150"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <GoChevronLeft />
                </button>
                {renderPageNumbers()}

                <select
                    className="px-2 py-1 border border-gray-400 rounded text-sm
                           hover:bg-gray-200 hover:text-black 
                           focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50 
                           transition ease-in duration-150 bg-white text-gray-800"
                    value={localPerPage}
                    onChange={handlePerPageChange}
                >
                    {[defaultPerPage, defaultPerPage + 5, defaultPerPage + 10, defaultPerPage + 25].map(size => (
                        <option key={size} value={size}>{size} per page</option>
                    ))}
                </select>
                <button
                    className="px-2 py-1 border border-gray-400 rounded text-sm 
                           hover:bg-gray-200 hover:text-black 
                           focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50 
                           transition ease-in duration-150"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <GoChevronRight />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
