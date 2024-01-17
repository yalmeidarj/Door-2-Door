"use client"
import { getAllHouses, getAllHousesInLocation, getAllLocationsDropDown } from '@/app/actions/actions';
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { ColumnDef, ColumnFilter, FilterFn } from '@tanstack/react-table';
import Spinner from './Spinner';
import { set } from 'date-fns';


interface Location {
    id: number;
    name: string;
    neighborhood: string;
    priorityStatus: number;
    isDeleted: boolean;
    // ... other fields
}

interface Street {
    id: number;
    name: string;
    locationId: number;
    lastVisited: Date | null;
    lastVisitedby: string | null;
    // ... other fields
}

interface House {
    // accessorKey: string;
    id: number;
    streetNumber: number;
    lastName: string | null;
    name: string | null;
    type: string | null;
    streetId: number;
    locationId: number;
    statusAttempt: string | null;
    lastUpdated: Date | null;
    lastUpdatedBy: string | null;
    internalNotes: string | null;
    externalNotes: string | null;
    Location: Location;
    Street: Street;
}


type LocationDropdown = {
    id: number;
    name: string;
}[];




const fuzzyFilter: FilterFn<House> = (row, columnId, filterValue, addMeta) => {
    // Get the value from the row using the columnId
    const rowValue = row.getValue(columnId);

    // If the filter value is undefined or null, return true for all rows
    if (!filterValue) {
        return true;
    }

    // Convert both the row value and the filter value to a common case for case-insensitive comparison
    const rowValueString = String(rowValue).toLowerCase();
    const filterValueLower = filterValue.toLowerCase();

    // Check if the filter value is a substring of the row value
    return rowValueString.includes(filterValueLower);
};


const HousesTable = () => {
    const [data, setData] = useState<House[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])
    const [locations, setLocations] = useState<LocationDropdown>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(100); // Rows per page
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);// Rows per page
    const [initialCsvData, setInitialCsvData] = useState<House[]>([]);

    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const fetchedLocations = await getAllLocationsDropDown();
                // Check if fetchedLocations is an array and set locations
                if (Array.isArray(fetchedLocations)) {
                    setLocations(fetchedLocations);
                } else {
                    // If fetchedLocations is not an array, handle it as an error
                    setFetchError(fetchedLocations.error);
                }
            } catch (error) {
                const errorMessage = error?.toString() || "Error fetching locations";
                console.error("Error fetching locations:", error);
                setFetchError(errorMessage);
            }
        };

        fetchLocations();
    }, []);

    // Step 5: Handle location selection change
    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocationId(event.target.value);
    };

    // Fetch data with pagination
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const skip = page * rowsPerPage;
                const take = rowsPerPage;
                if (selectedLocationId) {
                    const result = await getAllHousesInLocation(selectedLocationId, skip, take);
                    if (result && result.data) {
                        setData(result.data);
                        setTotalRecords(result.metadata.totalRecords);
                        setTotalPages(result.metadata.totalPages);
                        setInitialCsvData(result.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching houses:", error);
                // Handle error appropriately
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedLocationId, page, rowsPerPage]);


    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const columns: ColumnDef<House>[] = [
        {
            accessorKey: 'streetNumber',
            header: 'Street Number',
            // size: 50,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'Street.name',
            header: 'Street Name',
            // size: 100,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'statusAttempt',
            header: 'Status ',
            // size: 50,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            // size: 50,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'internalNotes',
            header: 'Internal Notes',
            // size: 25,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'externalNotes',
            header: 'External Notes',
            // size: 25,
            filterFn: fuzzyFilter as FilterFn<House>,
        },

        {
            accessorKey: 'lastUpdated',
            header: 'Last edited on',
            // size: 100,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'lastUpdatedBy',
            header: 'Last edited by ',
            // size: 50,
            filterFn: fuzzyFilter as FilterFn<House>,
        },
        {
            accessorKey: 'Location.name',
            header: 'Location Name',
            // size: 50,
            filterFn: fuzzyFilter as FilterFn<House>,
        },

        // ... other location and street fields
    ];

    const convertToCSV = (data: House[]): string => {
        const headers = columns.map(col => col.id); // Use 'id' instead of 'accessorKey'

        const rows = data.map(row => {
            return columns.map(col => {
                let cellValue = '';

                if ('accessorKey' in col && col.accessorKey) {
                    const accessorKey = col.accessorKey;
                    // Check if the property exists on the row and is not a function
                    if (accessorKey in row && typeof row[accessorKey as keyof House] !== 'function') {
                        const value = row[accessorKey as keyof House];
                        cellValue = value != null ? value.toString() : '';
                    }
                }

                // Replace double quotes in cellValue and enclose in double quotes
                return `"${cellValue.replace(/"/g, '""')}"`;
            }).join(',');
        });

        return [headers.join(','), ...rows].join('\r\n');
    };


    const downloadCSV = () => {
        const csvData = convertToCSV(initialCsvData);
        console.log(`CSV Data:\n${csvData}`); // Debugging: Inspect CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'houses_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePageChange = (newPage:any) => {
        setPage(Math.max(0, Math.min(newPage, totalPages - 1))); // Ensure newPage is within range
    };

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const getPageRange = (current: number, total: number) => {
        const range = 3; // Number of pages to show before and after the current page
        const start = Math.max(2, current - range);
        const end = Math.min(total - 1, current + range);

        const pages = [];
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < total - 1) pages.push('...');

        return pages;
    };


    if (loading) {
        return (
            <div className="flex flex-row w-md justify-start item-center">
            < Spinner />

            </div>)
    }
    return (
        <div className='m-4 p-2 gap-2 w-full bg-slate-600 overflow-auto'>
            {/* Step 4: Dropdown for selecting location */}
            <select value={selectedLocationId} onChange={handleLocationChange} className="mb-4 p-2 rounded border border-gray-300">
                <option value=" ">Select a Location</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                ))}
            </select>

            {/* Pagination and Rows per Page Selection */}
            <div className='flex flex-wrap justify-between items-center mb-4 p-2 gap-2 bg-slate-200 '>
            
                    <div className="flex items-center space-x-2">

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(0)}
                            disabled={page === 0}>
                            First Page
                        </button>

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}>
                            Previous
                        </button>

                        {getPageRange(page, totalPages).map((p, index) => (
                            <button
                                key={index}
                                className={`bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border ${page === p ? 'border-blue-700' : 'border-blue-500'} rounded hover:border-transparent disabled:opacity-50`}
                                onClick={() => handlePageChange(typeof p === 'number' ? p : page)}
                                disabled={typeof p !== 'number'}>
                                {p}
                            </button>
                        ))}

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page + 1 >= totalPages}>
                            Next
                        </button>

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={page + 1 >= totalPages}>
                            Last Page
                        </button>
                    

                    <div className="flex gap-2 items-center">
                        <label className="block text-sm font-bold text-gray-700">
                            Rows per page:
                            <select className="ml-2 p-1 rounded border border-gray-300 focus:outline-none" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                                {[100, 150, 250, 500].map(size => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button className="bg-gray-100 hover:bg-green-400 text-green-700 font-semibold hover:text-white py-1 px-3 text-sm border border-green-500 rounded hover:border-transparent disabled:opacity-50" onClick={downloadCSV}>Download CSV</button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className='min-w-full table-auto border-collapse border border-green-800'>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                <div className='flex flex-col '>
                                
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {/* Add an input for filtering */}

                                <input
                                    value={header.column.getFilterValue() || ''}
                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                    placeholder={`Filter ${header.column.id}...`}
                                    />
                                    </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, rowIndex) => (
                            <tr key={row.id} className={`${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="border border-green-800">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

            </table>
            

            </div>
        </div>
    );
};

export default HousesTable;

