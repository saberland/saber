module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        theme: `var(--theme-color)`
      }
    }
  },
  variants: {
    display: ['responsive', 'group-hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'focus-within']
  },
  plugins: [require('@tailwindcss/ui')()]
}
