'use client';

import { m } from 'framer-motion';

interface FadeInHeadingProps {
    children: React.ReactNode;
    className?: string;
}

export function FadeInHeading({ children, className }: FadeInHeadingProps) {
    return (
        <m.h2
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </m.h2>
    );
}
