import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary100: '#D5E6F5',
        primary200: '#ACCDEB',
        primary300: '#83B4E1',
        primary400: '#5A9BD7',
        primary: '#3182CE',
        primary600: '#2768A4',
        primary700: '#1D4E7B',
        primary800: '#133452',
        primary900: '#0E273D',

        bgblue: "#F7FAFC",
        bgblue200: "#E2EDF5",
        darkblue: "#132537",
        darkblue200: "#042444",
        darkblue300: "#00162D",

        bggray: "#F9F9F9",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
