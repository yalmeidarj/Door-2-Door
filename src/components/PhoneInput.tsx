"use client";

import React from "react";

interface PhoneInputProps {
    value: string;
    onChange: (newValue: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
    const formatCanadianPhoneNumber = (input: string): string => {
        const digits = input.replace(/\D/g, "").slice(0, 10); // Only keep up to 10 digits
        const length = digits.length;

        if (length === 0) {
            return "";
        } else if (length <= 3) {
            // Up to 3 digits: "(XXX"
            return `(${digits}`;
        } else if (length <= 6) {
            // 4 to 6 digits: "(XXX) XXX"
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
            // 7 to 10 digits: "(XXX) XXX-XXXX"
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawInput = event.target.value;
        const formatted = formatCanadianPhoneNumber(rawInput);
        onChange(formatted);
    };

    return (
        <input
            value={value}
            name="phone"
            id="phone"
            type="tel"
            autoComplete="off"
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
                 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="(XXX) XXX-XXXX"
        />
    );
}

