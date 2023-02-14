import type { AnimationItem } from "lottie-web";


export interface LottieAnimationConfig {
    id?: string
    src: string
    player?: "light" | "full"
    loop?: boolean
    autoplay?: boolean | "visible"
}

export type LottieAnimation = Readonly<{
    id: string
    config: LottieAnimationConfig
    container: HTMLElement
} & (
        | {
            isLoaded: true
            player: AnimationItem
        }
        | {
            isLoaded: false
            player: undefined
        }
    )>

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
