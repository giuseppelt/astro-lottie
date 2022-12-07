import type { AnimationItem } from "lottie-web";

export interface LottieAnimationConfig {
    src: string
    player?: "light" | "full"
    loop?: boolean
    autoplay?: boolean | "visible"
}


requestAnimationFrame(async () => {

    const DEFAULT: Partial<LottieAnimationConfig> = {
        player: "light",
        loop: true,
        autoplay: "visible",
    }

    const containers = [...document.querySelectorAll("[data-lottie]")].map(x => {
        try {
            return [x, { ...DEFAULT, ...JSON.parse(x.getAttribute("data-lottie-data") || "") }];
        } catch (err) {
            console.warn("Cannot parse lottie animation data", x);
        }
    }).filter(x => !!x) as [HTMLElement, LottieAnimationConfig][];

    if (containers.length === 0) {
        // no lottie animation return
        return;
    }

    const isFull = containers.some(([, config]) => config.player === "full");
    const lottie = await (isFull
        ? import("lottie-web")
        : import("lottie-web/build/player/lottie_light")
    )
        .then(x => x.default)
        .catch(err => {
            console.warn("Cannot load lottie-web script", err);
        });

    if (!lottie) {
        return;
    }

    //assign as global object
    (window as any).lottie = lottie;

    // load animations
    const animationDataMap = new Map((await Promise.all(
        [...new Set(containers.map(([_, config]) => config.src))].map(async src => {
            const response = await fetch(src).catch(() => { });
            if (!response || response.status >= 400) {
                console.warn("Cannot load animation(%s)", src);
                return;
            }

            const data = await response.json().catch(() => { });
            if (!data) {
                console.warn("Cannot load animation(%s)", src);
                return;
            }

            return [src, data] as const;
        })
    )).filter(x => !!x) as [string, any][]);


    const animations = containers.map(([container, config]) => {
        const animationData = animationDataMap.get(config.src);
        if (!animationData) return;

        const { loop, autoplay } = config;
        const player = lottie.loadAnimation({
            container,
            loop,
            autoplay: autoplay === "visible" ? false : autoplay,
            animationData,
            rendererSettings: {
                viewBoxOnly: true,
            },
        });

        return [container, config, player] as const;
    }).filter(x => !!x) as [HTMLElement, LottieAnimationConfig, AnimationItem][];

    const toObserve = animations.filter(([, config]) => config.autoplay === "visible");
    if (toObserve.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(x => {
            const animation = animations.find(([container]) => container === x.target);
            if (animation) {
                if (x.isIntersecting) {
                    animation[2].play();
                } else {
                    animation[2].pause();
                }
            }
        });
    }, { threshold: 0.01 });

    toObserve.forEach(([element]) => {
        observer.observe(element);
    });
});
