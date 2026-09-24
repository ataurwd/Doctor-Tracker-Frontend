import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Palette from Clustr Studio specification
        brand: {
          bold: "#1E46EB",        // Bold Blue (Primary)
          boldDark: "#1535b8",    // Hover shade
          light: "#67BAF4",       // Light Blue (Secondary/Accent)
          softWhite: "#FAFAFA",   // Soft White (App Background)
          jetBlack: "#0D0D0D",    // Jet Black (Headings & Typography)
          surface: "#FFFFFF",     // Card / Modal / Table Surface
          border: "#E2E8F0",      // Crisp Light Border
          muted: "#64748B",       // Neutral Gray for secondary text
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(13, 13, 13, 0.04), 0 1px 2px -1px rgba(13, 13, 13, 0.04)",
        cardHover: "0 10px 25px -5px rgba(30, 70, 235, 0.08), 0 8px 10px -6px rgba(30, 70, 235, 0.04)",
        modal: "0 20px 25px -5px rgba(13, 13, 13, 0.1), 0 8px 10px -6px rgba(13, 13, 13, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
