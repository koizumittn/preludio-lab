import { SITE_NAME } from '@/lib/constants';

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white py-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                    Beyond Listening. Dive deeper into the classics.
                </p>
            </div>
        </footer>
    );
};
