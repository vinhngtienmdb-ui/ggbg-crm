import type { Config } from "tailwindcss";

/**
 * GGBingo CRM design system (áp dụng bộ nhận diện Claude Design).
 * Font: Be Vietnam Pro. Palette xanh #2E5CE6, nền #F3F4F6, viền #E4E7EC.
 *
 * Chiến lược: ánh xạ lại các thang màu mặc định của Tailwind (slate/blue/indigo)
 * sang đúng tông của bộ thiết kế, nhờ đó toàn bộ giao diện hiện có tự đồng bộ
 * mà không phải sửa từng class ở mọi trang. Các thang success/warn/danger được
 * tinh chỉnh nhẹ cho khớp tint của thiết kế.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutrals của thiết kế (thay cho slate mặc định)
        slate: {
          50: '#F3F4F6',
          100: '#F0F1F4',
          200: '#E4E7EC',
          300: '#D3D7DF',
          400: '#98A2B3',
          500: '#667085',
          600: '#5B657F',
          700: '#3A414E',
          800: '#252B36',
          900: '#16181D',
          950: '#0B0D12',
        },
        // Xanh thương hiệu (primary) — thay cho blue & indigo
        blue: {
          50: '#EEF2FE',
          100: '#DFE7FD',
          200: '#C7D5FB',
          300: '#9DB6F6',
          400: '#6E8AE8',
          500: '#4770E0',
          600: '#2E5CE6',
          700: '#1D46C4',
          800: '#1D3EA8',
          900: '#1B357F',
          950: '#12224F',
        },
        indigo: {
          50: '#EEF2FE',
          100: '#DFE7FD',
          200: '#C7D5FB',
          300: '#9DB6F6',
          400: '#6E8AE8',
          500: '#4770E0',
          600: '#2E5CE6',
          700: '#1D46C4',
          800: '#1D3EA8',
          900: '#1B357F',
          950: '#12224F',
        },
        // Tím phụ trợ (accent)
        violet: {
          50: '#F4F1FE',
          100: '#E2D9FB',
          200: '#CFC0F6',
          500: '#6D3FD4',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        purple: {
          50: '#F4F1FE',
          100: '#E2D9FB',
          500: '#6D3FD4',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        // Xanh lá — success (khớp tint thiết kế)
        emerald: {
          50: '#EEF4EE',
          100: '#D3E4D3',
          200: '#B9D6BA',
          500: '#2FA84F',
          600: '#1F7A33',
          700: '#186628',
        },
        green: {
          50: '#EEF4EE',
          100: '#D3E4D3',
          500: '#2FA84F',
          600: '#1F7A33',
          700: '#186628',
        },
        // Hổ phách — warning
        amber: {
          50: '#FDF3E7',
          100: '#FBF3D9',
          200: '#F5E1B8',
          500: '#D97706',
          600: '#B25E09',
          700: '#92400E',
        },
        // Đỏ — danger
        red: {
          50: '#FDEEEE',
          100: '#FADCDD',
          200: '#F3C4C6',
          500: '#E04A50',
          600: '#C22F35',
          700: '#A11F25',
        },
        rose: {
          50: '#FDEEEE',
          100: '#FADCDD',
          500: '#E04A50',
          600: '#C22F35',
        },
        // Xanh mòng két — info phụ
        cyan: {
          50: '#E4F6F8',
          100: '#CCEDF1',
          600: '#0E7490',
          700: '#0E7490',
        },
        teal: {
          50: '#E4F6F8',
          600: '#0E7490',
          700: '#0E7490',
        },
        // Token ngữ nghĩa dùng trực tiếp khi cần
        brand: {
          50: '#EEF2FE',
          100: '#DFE7FD',
          200: '#C7D5FB',
          400: '#6E8AE8',
          500: '#4770E0',
          600: '#2E5CE6',
          700: '#1D46C4',
          900: '#1B357F',
        },
        ink: '#16181D',
        muted: '#667085',
        subtle: '#98A2B3',
        line: '#E4E7EC',
        canvas: '#F3F4F6',
        sidebar: {
          bg: '#FFFFFF',
          hover: '#EEF2FE',
          active: '#2E5CE6',
          text: '#3A414E',
          textActive: '#1D46C4',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04)',
        'card-hover': '0 6px 18px -8px rgba(15,23,42,0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
