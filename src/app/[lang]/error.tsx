'use client';

import { useEffect } from 'react';
import { handleClientError } from '@/lib/client-error';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error using our standardized handler
        handleClientError(error, 'Something went wrong while loading the page.');
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Something went wrong!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                We apologize for the inconvenience. The error has been logged.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-2 bg-primary/90 hover:bg-primary text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                Try again
            </button>
        </div>
    );
}
