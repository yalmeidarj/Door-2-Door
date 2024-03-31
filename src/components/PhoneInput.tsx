"use client"

import { useState } from "react";

export default function PhoneInput() {
    const [value, setValue] = useState('');

    const formatCanadianPhoneNumber = (phoneNumber: string): string => {
        const digits = phoneNumber.replace(/\D/g, '').slice(0, 10); // Ensure only 10 digits are considered
        const match = digits.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const part1 = match[1] ? `(${match[1]}` : '';
            const part2 = match[2] ? `) ${match[2]}` : '';
            const part3 = match[3] ? `-${match[3]}` : '';
            return `${part1}${part2}${part3}`.trimEnd();
        }
        return phoneNumber;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the input based on the formatted value
        setValue((prevValue) => {
            const formattedPhoneNumber = formatCanadianPhoneNumber(event.target.value);
            // Prevent adding more digits if 10 digits already entered
            if (formattedPhoneNumber.replace(/\D/g, '').length <= 10) {
                return formattedPhoneNumber;
            }
            return prevValue; // Keep the previous value if more than 10 digits
        });
    };

    return (
        <input
            value={value}
            name="phone"
            id="phone"
            type="tel"
            autoComplete="off"
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="(XXX) XXX-XXXX"
        />
    );
};