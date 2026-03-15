/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E3A8A', // Deep Blue
        'secondary': '#16A34A', // Green
        'accent': '#F59E0B', // Warm Orange
        'bg-primary': '#F9FAFB', // Light neutral
        'card-bg': '#FFFFFF',
        'text-main': '#111827',
        'text-sub': '#6B7280',
        'border-gray': '#E5E7EB',
      },
      fontFamily: {
        'devanagari': ['"Noto Sans Devanagari"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'gov': '14px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'strong': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
