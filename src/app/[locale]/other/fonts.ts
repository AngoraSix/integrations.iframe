import { Lato } from 'next/font/google';

export const lato = Lato({
    weight: ['100', '300', '400', '700', '900'], // Include all available weights
    style: ['normal', 'italic'], // Include both normal and italic styles
    subsets: ['latin'], // Add other subsets if needed
    display: 'swap', // Recommended for performance
    variable: '--font-lato', // Custom CSS variable
});