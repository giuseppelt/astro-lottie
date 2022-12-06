# Astro Lottie
Use [Lottie](https://github.com/airbnb/lottie-web) animations within your [Astro](https://astro.build) website.


## Installation
**astro-integration-lottie** requires **lottie-web** to be installed as well.
```bash
npm i astro-integration-lottie lottie-web
# or
pnpm add astro-integration-lottie lottie-web
# or
yarn add astro-integration-lottie lottie-web
```

## Usage
### Integration
Required first step: add the integration to your `astro.config` file.
```ts 
import { defineConfig } from "astro/config";
import lottie from "astro-integration-lottie";

export default defineConfig({
  integrations: [
    lottie(), // <-- add integration
  ]
});
```

### Component
Inside your astro page or component, you can import the Lottie component. It supports props autocompletion and type checking.
```astro
---
import LottieAnimation from "astro-integration-lottie/Lottie.astro";
---
<div class="container">
    <LottieAnimation src="assets/animation.json" autoplay="visible" />
</div>
```

## How `Astro Lottie` works
### Player loading
The lottie player is not bundled within your page. It's asynchronously fetched only when a page contains at least one lottie animation.

This package allows to load two players:
- `light`: small player with only svg rendering
- `full`: all featured player, with all capabilities

You can read more about lottie players in the [Lottie repository](https://github.com/airbnb/lottie-web).

When a page contains multiple animations with different players specified, the _greater_ player will be loaded. So to load the light player, all animation musts set the `player="light"` (or no player at all, as the default one is the `"light"`).

The lottie player is locally saved in the public folder (it's handled under the hood by astro/vite) so no external request is sent.

### Animation loading
The lottie animations are not bundled in your page. They're asynchronously fetched when the page loading ends, when a small loader script is run. 

The loader will
- check if the page has any lottie animations
- fetch the lottie player
- download the animations (if one is used multiple times, it's downloaded once)
- setup each the animation on the page
- if the autoplay is `true`, the animation is started right away, otherwise the animation will play only when it's visible and paused when it exits the screen. This is achieved thanks to `IntersectionObserver`, with a visibility filter 0.01.


## Reference
### Lottie (component) Props
| property | type                  | usage    | description                              | 
|:---------|:----------------------|:---------|:-----------------------------------------|
| src      | `string`              | required | the public path from where the animation will be downloaded |
| player   | `"light"` \| `"full"`  | optional(`"light"`)    | which lottie player to load |
| loop     | `boolean`             | optional(`true`)      | play the animation on loop |
| autoplay | `true` \| `"visible"` | optional(`"visible"`) | starts the animation as soon it loads or only when it's visible on the page |


## Types
This package is built in typescript so it has full typings support.

## License
[MIT](LICENSE) © [Giuseppe La Torre](https://github.com/giuseppelt)
