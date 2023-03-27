# Getting Started

You may add the usage of the library here.

## Setup

This setup assumes your client app is created with Vite and vue-ts template, and you use 'npm link' to link to `@yakies/vue-components` locally.

In your `package.json`, you shall have the dependencies compatible with the following:

```json
"dependencies": {
  "@yakies/vue-components": "latest",
  "vue": "^3.2.37"
}
```

In your `vite.config.ts`, you shall configure to dedupe `vue`:

```ts
export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
});
```

In your `main.ts`, you shall import the libraries and CSS:

```ts
import '@yakies/vue-components/dist/style.css';
```

Import components from this library in your own component:

```html
<script setup lang="ts">
  import { IconEffect,LottiePlayer } from '@yakies/vue-components';
</script>
```
