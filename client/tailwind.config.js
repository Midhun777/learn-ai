/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#6366f1',
                'brand-secondary': '#a855f7',
                'brand-accent': '#f43f5e',
                'soft-blue': '#e0e7ff',
                'soft-purple': '#f3e8ff',
                'soft-pink': '#fce7f3',
                'soft-green': '#dcfce7',
                'soft-yellow': '#fef9c3',
                'ui-bg': '#f8fafc',
            },
            borderRadius: {
                'soft': '1.5rem',
            },
            boxShadow: {
                'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                'float': '0 20px 40px -10px rgba(99, 102, 241, 0.15)',
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'pop': 'pop 0.3s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(0.95)' },
                    '70%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}

