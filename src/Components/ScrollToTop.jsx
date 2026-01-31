import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Force window/document scroll
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);

        // 2. Force scroll on known container classes if they exist and are scrollable
        // "sidebar-main" and "sidebar-layout-root" are main wrappers
        const scrollableSelectors = [
            '.sidebar-main',
            '.sidebar-layout-root',
            'main',
            '#root > div' // outermost app div
        ];

        scrollableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                try {
                    el.scrollTop = 0;
                } catch (e) {
                    // ignore
                }
            });
        });

    }, [pathname]);

    return null;
};

export default ScrollToTop;
