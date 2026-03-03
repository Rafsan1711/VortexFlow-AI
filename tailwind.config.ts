import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#111118',
        'surface-2': '#1A1A24',
        'surface-3': '#22222E',
        border: '#2A2A3A',
        'border-bright': '#3D3D52',
        primary: {
          DEFAULT: '#00D4FF',
          glow: 'rgba(0,212,255,0.15)',
        },
        secondary: {
          DEFAULT: '#7B61FF',
          glow: 'rgba(123,97,255,0.15)',
        },
        accent: {
          warm: '#FF6B35',
        },
        success: '#00E5A0',
        error: '#FF4D6A',
        warning: '#FFB830',
        text: {
          primary: '#F0F0FF',
          secondary: '#9898B8',
          muted: '#5C5C7A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(123,97,255,0.08) 0%, transparent 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
