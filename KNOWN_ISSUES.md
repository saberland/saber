# Known Issues

## Inline Critical CSS

If you're using a `.js` file as page component, the CSS imported there won't be inlined in the initial HTML sent by the server.

Inlining Critical CSS only works with `<style>` tag in `.vue` files and regular `.js` files for now.
