module.exports = {
  plugins: [
    // Use the @tailwindcss/postcss entry if installed; otherwise Tailwind's main package is fine.
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
