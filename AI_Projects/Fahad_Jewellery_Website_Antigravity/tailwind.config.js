/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-deep': '#0C1636',
        'navy-royal': '#151542',
        'gold-accent': '#C5A059',
        'gold-light': '#E6CA85',
        'blue-accent': '#0066FF',
        'pearl-white': '#FFFFFF',
        'ivory-surface': '#FAF9F6',
        'onyx': '#1A1A1A',
        'muted-gray': '#595959',
        'border-silver': '#E5E5E5',
      },
      fontFamily: {
        'serif-luxury': ['Lora', 'Outfit', 'Georgia', 'serif'],
        'heading-outfit': ['Outfit', 'Lora', 'sans-serif'],
        'sans-body': ['Nunito Sans', 'Gantari', 'sans-serif'],
        'script-accent': ['Pinyon Script', 'cursive'],
      },
      boxShadow: {
        'luxury-sm': '0 2px 8px rgba(12, 22, 54, 0.06)',
        'luxury-md': '0 6px 20px rgba(12, 22, 54, 0.1)',
        'luxury-lg': '0 12px 36px rgba(12, 22, 54, 0.15)',
        'gold-glow': '0 0 20px rgba(197, 160, 89, 0.3)',
      },
      borderRadius: {
        'brand': '4px',
      }
    },
  },
  plugins: [],
}
