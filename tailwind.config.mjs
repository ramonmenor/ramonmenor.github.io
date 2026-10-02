import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' },
				},
				pulseGlow: {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.9', transform: 'scale(1.03)' },
				},
			},
			animation: {
				marquee: 'marquee 28s linear infinite',
				float: 'float 5s ease-in-out infinite',
				'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
			},
			colors: {
				accent: {
					cyan: '#00f0ff',
					amber: '#f59e0b',
					emerald: '#10b981',
				},
			},
		},
	},
	plugins: [typography],
}
