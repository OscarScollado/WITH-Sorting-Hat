import type { LayoutLoad } from "./$types";

/** This webapp is interactive-heavy, so it has to be an SPA rather than an SSR. */
export const ssr = false;
/** For SSG prerendering. */
export const prerender = true;
/** I need to figure out as soon as possible wether the user prefers which mode,
 *   therefore it will be the very first thing that will run on load,
 *   otherwise a FOUC will happen which is very visually unappealing.
*/
export const load = (() => {
    let mode = localStorage.getItem("mode");
    if (!mode) {
        const media = "(prefers-color-scheme: dark)";
        mode = window.matchMedia(media).matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-mode", mode);
    return { initialMode: mode === "dark" }
}) satisfies LayoutLoad;