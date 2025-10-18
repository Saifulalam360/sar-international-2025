import React, { useState, useEffect } from 'react';

// A helper function to parse JSON safely
function safeJsonParse<T>(jsonString: string | null): T | null {
    if (!jsonString) return null;
    try {
        const value = JSON.parse(jsonString);
        // Revive dates
        return JSON.parse(jsonString, (key, value) => {
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
            if (typeof value === 'string' && isoDateRegex.test(value)) {
                return new Date(value);
            }
            return value;
        });
    } catch (e) {
        console.error("Failed to parse JSON from localStorage", e);
        return null;
    }
}

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        const storedValue = safeJsonParse<T>(localStorage.getItem(key));
        return storedValue !== null ? storedValue : defaultValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving state for key "${key}" to localStorage.`, error);
        }
    }, [key, state]);

    return [state, setState];
}