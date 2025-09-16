/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@pipecat-ai/voice-ui-kit/dist/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gds-blue': '#3b82f6',
        'gds-purple': '#8b5cf6',
        'gds-green': '#10b981',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
