/* @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        circle: 'circle 0.5s alternate infinite ease',
        circle2: 'circle 0.5s alternate 0.2s infinite ease',
        circle3: 'circle 0.5s alternate 0.3s infinite ease',
        circle4: 'circle 0.5s alternate 0.4s infinite ease',
        circle5: 'circle 0.5s alternate 0.5s infinite ease',
        shadow: 'shadow 0.5s alternate infinite ease',
        shadow2: 'shadow 0.5s alternate 0.2s infinite ease',
        shadow3: 'shadow 0.5s alternate 0.3s infinite ease',
        shadow4: 'shadow 0.5s alternate 0.4s infinite ease',
        shadow5: 'shadow 0.5s alternate 0.5s infinite ease',
      },
      keyframes: {
        circle: {
          '0%': {
            top: '60px',
            height: '5px',
            borderRadius: '50px 50px 25px 25px',
            transform: 'scaleX(1.7)',
          },
          '40%': {
            height: '20px',
            borderRadius: '50%',
            transform: 'scaleX(1)',
          },
          '100%': { top: '0%' },
        },
        shadow: {
          '0%': { transform: 'scaleX(1.5)' },
          '40%': { transform: 'scaleX(1)', opacity: '0.7' },
          '100%': { transform: 'scaleX(0.2)', opacity: '0.4' },
        },
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
};
