module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
        pretendard: [
          "var(--font-pretendard)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          25: "var(--color-brand-25)",
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          200: "var(--color-brand-200)",
          300: "var(--color-brand-300)",
          400: "var(--color-brand-400)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
          800: "var(--color-brand-800)",
          900: "var(--color-brand-900)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
          950: "var(--color-neutral-950)",
        },
        label: {
          normal: "var(--color-label-normal)",
          strong: "var(--color-label-strong)",
          neutral: "var(--color-label-neutral)",
          alternative: "var(--color-label-alternative)",
          assistive: "var(--color-label-assistive)",
          disable: "var(--color-label-disable)",
          inverse: {
            normal: "var(--color-label-inverse-normal)",
            neutral: "var(--color-label-inverse-neutral)",
            alternative: "var(--color-label-inverse-alternative)",
            assistive: "var(--color-label-inverse-assistive)",
            disable: "var(--color-label-inverse-disable)",
          },
        },
        surface: {
          "normal-light": "var(--color-surface-normal-light)",
          "normal-light-alternative":
            "var(--color-surface-normal-light-alternative)",
          "elevated-light": "var(--color-surface-elevated-light)",
          "elevated-light-alternative":
            "var(--color-surface-elevated-light-alternative)",
          "dim-normal": "var(--color-surface-dim-normal)",
          "dim-neutral": "var(--color-surface-dim-neutral)",
          "dim-strong": "var(--color-surface-dim-strong)",
        },
        status: {
          positive: {
            light: "var(--color-status-positive-light)",
            normal: "var(--color-status-positive-normal)",
            dark: "var(--color-status-positive-dark)",
          },
          negative: {
            light: "var(--color-status-negative-light)",
            normal: "var(--color-status-negative-normal)",
            dark: "var(--color-status-negative-dark)",
          },
          warning: {
            light: "var(--color-status-warning-light)",
            normal: "var(--color-status-warning-normal)",
            dark: "var(--color-status-warning-dark)",
          },
        },
      },
      fontSize: {
        "display-1": [
          "var(--font-size-display-1)",
          {
            lineHeight: "var(--line-height-display-1)",
            letterSpacing: "var(--letter-spacing-display-1)",
          },
        ],
        "display-2": [
          "var(--font-size-display-2)",
          {
            lineHeight: "var(--line-height-display-2)",
            letterSpacing: "var(--letter-spacing-display-2)",
          },
        ],
        "title-1": [
          "var(--font-size-title-1)",
          {
            lineHeight: "var(--line-height-title-1)",
            letterSpacing: "var(--letter-spacing-title-1)",
          },
        ],
        "title-2": [
          "var(--font-size-title-2)",
          {
            lineHeight: "var(--line-height-title-2)",
            letterSpacing: "var(--letter-spacing-title-2)",
          },
        ],
        "title-3": [
          "var(--font-size-title-3)",
          {
            lineHeight: "var(--line-height-title-3)",
            letterSpacing: "var(--letter-spacing-title-3)",
          },
        ],
        "heading-1": [
          "var(--font-size-heading-1)",
          {
            lineHeight: "var(--line-height-heading-1)",
            letterSpacing: "var(--letter-spacing-heading-1)",
          },
        ],
        "heading-2": [
          "var(--font-size-heading-2)",
          {
            lineHeight: "var(--line-height-heading-2)",
            letterSpacing: "var(--letter-spacing-heading-2)",
          },
        ],
        "body-1": [
          "var(--font-size-body-1)",
          {
            lineHeight: "var(--line-height-body-1)",
            letterSpacing: "var(--letter-spacing-body-1)",
          },
        ],
        "body-2": [
          "var(--font-size-body-2)",
          {
            lineHeight: "var(--line-height-body-2)",
            letterSpacing: "var(--letter-spacing-body-2)",
          },
        ],
        "label-1": [
          "var(--font-size-label-1)",
          {
            lineHeight: "var(--line-height-label-1)",
            letterSpacing: "var(--letter-spacing-label-1)",
          },
        ],
        "label-2": [
          "var(--font-size-label-2)",
          {
            lineHeight: "var(--line-height-label-2)",
            letterSpacing: "var(--letter-spacing-label-2)",
          },
        ],
        "caption-1": [
          "var(--font-size-caption-1)",
          {
            lineHeight: "var(--line-height-caption-1)",
            letterSpacing: "var(--letter-spacing-caption-1)",
          },
        ],
        "caption-2": [
          "var(--font-size-caption-2)",
          {
            lineHeight: "var(--line-height-caption-2)",
            letterSpacing: "var(--letter-spacing-caption-2)",
          },
        ],
      },
    },
  },
  plugins: [],
};
