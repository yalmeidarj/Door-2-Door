"use client"
import React, { useState, useEffect } from 'react';
import { getAllAgents, getShiftsByAgentId } from '@/app/actions/actions';
import { format, subDays } from 'date-fns';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { Shift, ShiftsResponse } from '@/lib/Shift/types';
import ShiftCard from './ShiftCard';
import ShiftReportByDateRange from './ShiftReportByDateRange';
import LoadingSpinner from './LoadingSpinner';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShiftDurationDisplay = ({ shifts }) => {
    // Guard clause for when shifts is undefined or empty
    if (!shifts || shifts.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">No shift data available</p>
                </CardContent>
            </Card>
        );
    }

    // Calculate duration for each shift
    const shiftsWithDuration = shifts.filter(shift => shift.startingDate && shift.finishedDate)
        .map(shift => {
            const startTime = shift.startingDate;
            const endTime = shift.finishedDate;

            // Calculate duration in milliseconds
            const durationMs = endTime - startTime;

            // Convert to hours and minutes
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            return {
                ...shift,
                duration: {
                    hours,
                    minutes,
                    totalHours: durationMs / (1000 * 60 * 60),
                    raw: durationMs
                }
            };
        });

    // Guard clause for when no shifts have valid duration data
    if (shiftsWithDuration.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">No shifts with complete duration data available</p>
                </CardContent>
            </Card>
        );
    }

    // Calculate average duration
    const totalDuration = shiftsWithDuration.reduce((acc, shift) =>
        acc + shift.duration.raw, 0);
    const avgDuration = totalDuration / shiftsWithDuration.length;

    const avgHours = Math.floor(avgDuration / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgDuration % (1000 * 60 * 60)) / (1000 * 60));

    // Calculate total hours worked
    const totalHoursWorked = shiftsWithDuration.reduce((acc, shift) => acc + shift.duration.totalHours, 0);

    // Format the total hours worked for human readability in h:m format
    const formattedTotalHoursWorked = `${Math.floor(totalHoursWorked)}h ${Math.floor((totalHoursWorked - Math.floor(totalHoursWorked)) * 60)}m`;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 ">
                    <div className="py-2   p-2 bg-slate-200 text-night border-y items-center">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Hours:</span>
                            <span className="text-lg font-semibold">{formattedTotalHoursWorked}</span>
                        </div>
                    </div>
                    <div className="grid gap-4 bg-gray-50 rounded">
                        {shiftsWithDuration.map((shift, index) => (
                            <div key={index} className="flex justify-between items-center p-2  border-b border-slate-200">
                                <span className="text-sm font-medium">
                                    {new Date(shift.startingDate).toLocaleDateString()}
                                </span>
                                <span className="text-sm">
                                    {shift.duration.hours}h {shift.duration.minutes}m
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default function PersonalShifts({ agentId }: { agentId: string }) {
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    const [finishedShifts, setFinishedShifts] = useState<Shift[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: tenDaysAgo, to: now });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalHoursWorked, setTotalHoursWorked] = useState<string>('120');
    const [totalTimePerLocation, setTotalTimePerLocation] = useState<{ [key: string]: string }>({});
    const [housesNotFinal, setHousesNotFinal] = useState<number>(10);
    const [housesYes, setHousesYes] = useState<number>(20);
    const [housesNo, setHousesNo] = useState<number>(2);
    const [totalHouses, setTotalHouses] = useState<number>(100);

    const shifts = useQuery(api.shiftLogger.getFinishedShiftsByAgentId, {
        agentId: agentId,
        startDate: dateRange?.from ? dateRange.from.toUTCString() : tenDaysAgo.toUTCString(),
        // startDate: dateRange.from
        endDate: dateRange?.to ? dateRange.to.toUTCString() : now.toUTCString()
    });


    function resetSelections() {
        setDateRange({ from: subDays(new Date(), 5), to: new Date() });
        setFinishedShifts([]);
        setTotalHoursWorked('');
        setTotalTimePerLocation({});
    }


    const handleRangeChange = (range: DateRange | undefined) => {
        console.log(range)
        setDateRange(range);
    };
    return (
        
        <>
            <div className="mb-4">
                <DatePickerWithRange
                    dateRange={dateRange}
                    className="mb-4"
                    onChange={handleRangeChange}
                />
            </div>
            <div className="w-full flex justify-evenly gap-2 flex-wrap">
                <ShiftDurationDisplay shifts={shifts} />
                    {shifts?.map((shift) => (
                        <ShiftCard
                            key={shift._id}
                            shift={{
                                _id: shift._id,                                
                                siteID: shift.siteID,
                                startingDate: shift.startingDate,
                                finishedDate: shift.finishedDate,
                                isFinished: shift.isFinished,
                                _creationTime: shift._creationTime,
                                updatedHouses: shift.updatedHouses,
                                updatedHousesFinal: shift.updatedHousesFinal,
                                updatedHousesFinalNo: shift.updatedHousesFinalNo,
                            }}
                            diplayFinishedCard={true}
                        />
                    ))}
            </div>
        </>
            
    );
}
               