import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				floatSlow: {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-16px) rotate(2deg)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				pulseGlow: {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' },
				},
			},
			animation: {
				float: 'float 5s ease-in-out infinite',
				'float-slow': 'floatSlow 8s ease-in-out infinite',
				shimmer: 'shimmer 4s ease-in-out infinite',
				'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
			},
			colors: {
				void: {
					DEFAULT: '#050510',
					light: '#0a0a1a',
					card: '#0c0c1f',
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
		},
	},
	plugins: [typography],
}
