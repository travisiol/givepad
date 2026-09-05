import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#2a1024",
          60: "#2a102494",
          40: "#2a102466",
        },
        rose: {
          DEFAULT: "#ff5aa8",
          deep: "#e11d78",
          text: "#8a0f4b",
          soft: "#ffd5e8",
        },
        glass: {
          DEFAULT: "#ffffff85",
          strong: "#ffffffd6",
          border: "#ffffffcc",
        },
        primary: "#2a1024",
        muted: "#2a102494",
        subtle: "#2a102466",
        divider: "#2a102414",
        elevated: "#ffffff",
        success: "#2e9e5b",
        danger: "#d94a4a",
      },
      textColor: {
        primary: "#2a1024",
        muted: "#2a102494",
        subtle: "#2a102466",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Montserrat", "system-ui", "sans-serif"],
        balloon: ["var(--font-balloon)", "Baloo 2", "Arial Rounded MT Bold", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      letterSpacing: {
        kicker: "0.13em",
        btn: "0.08em",
        hero: "-0.035em",
        tight: "-0.025em",
      },
      borderRadius: {
        pill: "999px",
        card: "26px",
        "card-sm": "20px",
      },
      boxShadow: {
        glass: "inset 0 1px 0 #fffffff2, 0 18px 40px #18426033",
        "glass-sm": "inset 0 1px 0 #ffffffeb, 0 12px 30px #18426029",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
