import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'serif-en': ['var(--font-playfair)', 'serif'],
                'serif-ja': ['var(--font-zen-old-mincho)', 'serif'],
                'sans-en': ['var(--font-inter)', 'sans-serif'],
                'sans-ja': ['var(--font-noto-sans-jp)', 'sans-serif'],
                'sans-zh': ['var(--font-noto-sans-sc)', 'sans-serif'],
                'serif-zh': ['var(--font-noto-serif-sc)', 'serif'],
            },
        },
    },
    plugins: [],
};
export default config;
