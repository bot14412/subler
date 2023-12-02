import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte}'],
  plugins: [forms],
  theme: {
    extend: {
      brightness: {
        active: 'var(--brightness-active)',
        hover: 'var(--brightness-hover)',
      },
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--color-surface))',
          accent: 'rgb(var(--color-surface-accent))',
          font: 'rgb(var(--color-surface-font))',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          font: 'rgb(var(--color-primary-font))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
          font: 'rgb(var(--color-secondary-font))',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--color-tertiary))',
          font: 'rgb(var(--color-tertiary-font))',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success))',
          font: 'rgb(var(--color-success-font))',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning))',
          font: 'rgb(var(--color-warning-font))',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error))',
          font: 'rgb(var(--color-error-font))',
        },
      },
      strokeWidth: {
        4: '4px',
      },
    },
  },
};
