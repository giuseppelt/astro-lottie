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

### Type support
This integration defines the `astroLottie` global object to interact with your animations inside a page. Details on the [dedicated section](#accessing-the-lottie-player). You can have full type info of the `astroLottie` object with an environment reference.

Create an `env.d.ts` or, if you already have one, add the following line:
```ts
/// <reference types="astro-integration-lottie/env" />
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
- raise a document event `astro-lottie-loaded` when all animations are loaded and ready

### Accessing the Lottie Player
This plugin registers a `astroLottie` global object for the page.

```ts
const astroLottie = window.astroLottie;
if (!astroLottie) {
  // lottie is not registered! Either ...
  // - no lottie animation is present on this page
  // - lottie library failed to load  
} else {
  const animation = astroLottie.getAnimation("my-animation");
  animation.player.play();
}
```

The `AstroLottie` has two features:
- getting a specific animation by a key
- getting all animations present in the page

The full specification is:
```ts
export type AstroLottie = {
    /**
     * Get a LottieAnimation by the configured id
     */
    getAnimation(id: string): LottieAnimation | undefined

    /**
     * Get a LottieAnimation from the hosting element container
     */
    getAnimation(from: { container: HTMLElement }): LottieAnimation | undefined

    /**
     * Get a LottieAnimation from the hosting element container
     */
    getAnimation(from: { elementId: string }): LottieAnimation | undefined

    /**
     * Get all the LottieAnimation for the current page
     */
    getAllAnimations(): LottieAnimation[]
}
```

A `LottieAnimation` represents a single animation registered for the current page and is defined with:
```ts
export type LottieAnimation = Readonly<{
    id: string                        // the specified id es: <Lottie id="my-animation" />
    config: LottieAnimationConfig     // the full lottie configuration of the Lottie element
    container: HTMLElement            // the hosting dom element container
    isLoaded: boolean                 // specify if the animation is successfully loaded
    player?: AnimationItem            // this is the real Lottie player. It's defined when isLoaded is true
}>
```

The `player` property is the Lottie player, typed by the Lottie library itself. You can checkout [Lottie](https://github.com/airbnb/lottie-web#usage) repository for the documentation.


For example if you need to start an animation on demand when a button is clicked.
```ts
document.querySelector("#play-button").addEventListener("click", () => {
  const animation = astroLottie.getAnimation("my-animation");
  if (animation && animation.isLoaded) {
    animation.player.play();
  }
});
```

### Animation ready event
The loader emit a document event `astro-lottie-loaded` when all animations are loaded and ready. The `details` property of the event, is the `astroLottie` global object.

```ts
document.addEventListener("astro-lottie-loaded", e => {
  const astroLottie = e.details;
  const animations = astroLottie.getAllAnimations();
});
```

## Reference
### LottieAnimationConfig --> the Lottie component Props
| property | type                  | usage    | description                              | 
|:---------|:----------------------|:---------|:-----------------------------------------|
| id       | `string`              | optional | used to access the relative lottie player via javascript |
| src      | `string`              | required | the public path from where the animation will be downloaded |
| player   | `"light"` \| `"full"`  | optional(`"light"`)    | which lottie player to load |
| loop     | `boolean`             | optional(`true`)      | play the animation on loop |
| autoplay | `true` \| `"visible"` | optional(`"visible"`) | starts the animation as soon it loads or only when it's visible on the page |
| visibleThreshold | `number` | optional(`0`) | Range[0-1] for the visibility to start the animation: 1 means 100% visible, 0 means that just 1px will make the animation play. When multiple animations on the same page use different thresholds, the minimum will be used for all |



## Types
This package is built in typescript so it has full typings support.

## License
[MIT](LICENSE) © [Giuseppe La Torre](https://github.com/giuseppelt)
