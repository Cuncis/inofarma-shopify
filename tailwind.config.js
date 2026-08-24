import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Barlow', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                heading: '#0900aa',
                text: '#677279',
                accent: '#24ce30',
                border: '#e1e3e4',
                background: '#f3f5f6',
                'secondary-background': '#ffffff',
                error: '#ff0000',
                success: '#00aa00',
                'primary-button-bg': '#24ce30',
                'primary-button-text': '#ffffff',
                'secondary-button-bg': '#1e2d7d',
                'secondary-button-text': '#ffffff',
                'header-bg': '#0900aa',
                'header-text': '#ffffff',
                'header-light-text': '#a3afef',
                'header-accent': '#24ce30',
                'footer-bg': '#f3f5f6',
                'footer-heading': '#1e2d7d',
                'footer-body': '#677279',
                'footer-accent': '#00badb',
                'product-on-sale': '#ee0000',
                'product-in-stock': '#008a00',
                'product-low-stock': '#ee0000',
                'product-sold-out': '#8a9297',
                'custom-label-1-bg': '#008a00',
                'custom-label-2-bg': '#00a500',
                'review-star': '#ffbd00',
            },
            maxWidth: {
                container: '1140px',
                'container-medium': '960px',
                'container-narrow': '800px',
                'container-extra-narrow': '630px',
                'container-giga-narrow': '520px',
            },
            screens: {
                'max-phone': { max: '480px' },
                'max-mobile': { max: '640px' },
                tablet: '641px',
                'max-tablet': { max: '999px' },
                lap: '1000px',
                xl: '1280px',
                '2xl': '1440px',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                'fade-in-up': {
                    '0%': { opacity: 0, transform: 'translateY(6px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: 0, transform: 'scale(0.96)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out both',
                'fade-in-up': 'fade-in-up 0.35s ease-out both',
                'scale-in': 'scale-in 0.18s ease-out both',
            },
        },
    },

    plugins: [forms],
};
