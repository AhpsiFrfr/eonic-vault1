/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'rotate-slow': 'rotate 8s linear infinite',
        'hyperspeed': 'hyperspeed 2s ease-in-out forwards',
        'starburst': 'starburst 1.5s ease-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 15s linear infinite',
        'fadeOutZoom': 'fadeOutZoom 0.8s ease-out forwards',
        'backgroundFloat': 'floatBg 15s linear infinite',
        'glowPulse': 'pulseGlow 5s ease-in-out infinite',
        'hyperspeedFlash': 'flashGlow 0.5s ease-in',
        'starburstPulse': 'starburstPulse 1.5s ease-in-out infinite',
        'starPulse': 'starPulse 5s ease-in-out infinite',
        'hyperZoom': 'hyperZoom 2s ease-out forwards',
        'flashFade': 'flashFade 0.9s ease-in-out',
        'hyperTunnel': 'hyperTunnel 3s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'cameraShake': 'cameraShake 0.6s ease-in-out infinite',
        'whiteFlash': 'whiteFlash 0.8s ease-in',
        'hyperspeedTunnel': 'hyperspeedTunnel 2.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
      keyframes: {
        hyperspeed: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
          '100%': { opacity: 0, transform: 'scale(5)' },
        },
        starburst: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.8 },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.1)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(220px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(220px) rotate(-360deg)' },
        },
        fadeOutZoom: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
        floatBg: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.5 },
        },
        flashGlow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        starburstPulse: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        starPulse: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.7 }
        },
        hyperZoom: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(2.2)', opacity: 0 },
        },
        flashFade: {
          '0%': { opacity: 0 },
          '25%': { opacity: 0.95 },
          '100%': { opacity: 0 },
        },
        hyperTunnel: {
          '0%': {
            transform: 'scale(1) translateY(0)',
            filter: 'brightness(1)',
          },
          '50%': {
            transform: 'scale(1.5) translateY(-10px)',
            filter: 'brightness(1.3)',
          },
          '100%': {
            transform: 'scale(3) translateY(-30px)',
            opacity: 0,
            filter: 'brightness(2.5)',
          },
        },
        cameraShake: {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-2px, 1px)' },
          '50%': { transform: 'translate(2px, -1px)' },
          '75%': { transform: 'translate(-1px, 2px)' },
        },
        whiteFlash: {
          '0%': { opacity: 0 },
          '50%': { opacity: 0.9 },
          '100%': { opacity: 0 },
        },
        hyperspeedTunnel: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.3)', opacity: 1 },
          '100%': { transform: 'scale(1.6)', opacity: 0 },
        },
      },
      backgroundImage: {
        'stars': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%23FFFFFF\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%23FFFFFF\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hyperspeedTunnel': 'radial-gradient(ellipse at center, rgba(100,100,255,0.4) 0%, rgba(50,50,150,0.2) 45%, rgba(0,0,50,0.1) 80%, rgba(0,0,0,0) 100%)',
        'starburst-layer': 'url("/images/stars-pattern.png")',
        'star-streaks': 'url("/images/star-streaks.png")',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

