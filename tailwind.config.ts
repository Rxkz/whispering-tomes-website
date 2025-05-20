
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Dark Academia Color Palette
        "navy": "#0F1521",
        "gold": "#BF8D4E",
        "copper": "#A64B2A",
        "ivory": "#F5EFE0",
        "forest": "#2D4F3A",
        "antique": "#E8E0D0",
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
        'baskerville': ['Libre Baskerville', 'serif'],
        'garamond': ['EB Garamond', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'page-turn': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-15deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'dust': {
          '0%': { 
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: '0'
          },
          '10%': { opacity: '1' },
          '100%': {
            transform: 'translate(var(--dust-x, 100px), var(--dust-y, -100px)) rotate(360deg)',
            opacity: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'page-turn': 'page-turn 1.5s ease-out forwards',
        'fade-in': 'fade-in 1.5s ease-out forwards',
        'dust': 'dust 8s ease-in-out infinite'
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-texture.png')",
        'leather-texture': "url('/textures/leather-texture.png')",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
