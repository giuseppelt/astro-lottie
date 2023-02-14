import type { LottiePlayer } from "lottie-web";
import type { AstroLottie } from "./types";


declare global {
    interface Window {
        lottie?: LottiePlayer
        astroLottie?: AstroLottie
    }
}
