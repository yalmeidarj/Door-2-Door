"use client"
import React, { useState, useEffect } from 'react';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import ShiftCard from './ShiftCard';
import LoadingSpinner from './LoadingSpinner';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Id } from '../../convex/_generated/dataModel';

export type SingleShift = {
    _id: string;
    userID: string;
    siteID: string;
    orgID?: string;
    startingDate: number;
    finishedDate?: number;
    isFinished: boolean;
    onBreak?: boolean;
    updatedHouses?: number;
    updatedHousesFinal?: number;
    updatedHousesFinalNo?: number;
    pace?: number;
    maxInactiveTime?: number;
    shiftBreaks: Array<{
        _id: string;
        _creationTime: number;
        shiftId: string;
        siteID: string;
        description?: string;
        endTime?: number;
        motive: "inactivity" | "transit" | "general";
        status: string;
    }>;
};

export type ShiftBreakData =
    | { message: string }
    | SingleShift[];

interface ShiftDurationDisplayProps {
    // We'll accept ShiftBreakData which is the union
    // and handle the case when it's an array vs. when it's { message: string }
    shifts: ShiftBreakData;
}
// -----------------------------------------------
// ShiftDurationDisplay Component
// -----------------------------------------------
const ShiftDurationDisplay: React.FC<ShiftDurationDisplayProps> = ({ shifts }) => {
    // 1. Handle the case where shifts is not an array but rather { message: string }
    if (!Array.isArray(shifts)) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Show the message or a fallback if no message is provided */}
                    <p className="text-gray-500">{shifts.message ?? "No shift data available"}</p>
                </CardContent>
            </Card>
        );
    }

    // 2. From here on, we know 'shifts' is an array of shift objects.
    if (shifts.length === 0) {
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

    // 3. Filter out shifts without valid startingDate or finishedDate
    const shiftsWithDuration = shifts
        .filter((shift) => shift.startingDate && shift.finishedDate)
        .map((shift) => {
            const startTime = shift.startingDate;
            const endTime = shift.finishedDate!; // safe because of the filter

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
                    raw: durationMs,
                },
            };
        });

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

    // 4. Calculate total and average durations
    const totalDuration = shiftsWithDuration.reduce((acc, shift) => acc + shift.duration.raw, 0);
    const avgDuration = totalDuration / shiftsWithDuration.length;

    const avgHours = Math.floor(avgDuration / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgDuration % (1000 * 60 * 60)) / (1000 * 60));

    // 5. Calculate total hours worked
    const totalHoursWorked = shiftsWithDuration.reduce((acc, shift) => {
        return acc + shift.duration.totalHours;
    }, 0);

    // 6. Format total hours worked as h:m
    const formattedTotalHoursWorked = `${Math.floor(totalHoursWorked)}h ${Math.floor(
        (totalHoursWorked - Math.floor(totalHoursWorked)) * 60
    )}m`;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="py-2 p-2 bg-slate-200 text-night border-y items-center">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Hours:</span>
                            <span className="text-lg font-semibold">{formattedTotalHoursWorked}</span>
                        </div>
                    </div>

                    <div className="grid gap-4 bg-gray-50 rounded">
                        {shiftsWithDuration.map((shift, index) => (
                            <div
                                key={shift._id ?? index}
                                className="p-2 border-b border-slate-200"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        {new Date(shift.startingDate).toLocaleDateString()}
                                    </span>
                                    <span className="text-sm">
                                        {shift.duration.hours}h {shift.duration.minutes}m
                                    </span>
                                </div>

                                {/* Display Break Info */}
                                {/* <div className="mt-2 ml-4 text-xs text-gray-600">
                                    <p className="font-semibold">Breaks:</p>
                                    {shift.shiftBreaks && shift.shiftBreaks.length > 0 ? (
                                        shift.shiftBreaks.map((b) => (
                                            <div
                                                key={b._id}
                                                className="flex flex-col ml-2 my-1 border-l pl-2"
                                            >
                                                <span>Motive: {b.motive}</span>
                                                <span>Status: {b.status}</span>
                                                <span>
                                                    End Time:
                                                    {b.endTime
                                                        ? ` ${new Date(b.endTime).toLocaleTimeString()}`
                                                        : " N/A"}
                                                </span>
                                                {b.description && (
                                                    <span>Description: {b.description}</span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="ml-2">No breaks recorded</span>
                                    )}
                                </div> */}
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
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: tenDaysAgo, to: now });

    // const shifts = useQuery(api.shiftLogger.getFinishedShiftsByAgentId, {
    const shifts = useQuery(api.shiftLogger.getFinishedShiftBreakByAgentId, {
        agentId: agentId,
        startDate: dateRange?.from ? dateRange.from.toUTCString() : tenDaysAgo.toUTCString(),
        // startDate: dateRange.from
        endDate: dateRange?.to ? dateRange.to.toUTCString() : now.toUTCString()
    });

    if (!shifts) {
        return <div>Loading...</div>;
    }

    const handleRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
    };
    if (!Array.isArray(shifts)) {        
        return <div>No shifts found</div>;
    }
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
                {shifts.map((shift) => (
                    <ShiftCard key={shift._id} shift={shift} />
                ))}
            </div>
        </>
            
    );
}
               