const zpThemeController = (function () {
    const storageKey = "zp-theme";
    const ETheme = Object.freeze({
        Light: "light",
        Dark: "dark",
    });

    const zpThemeController = Object.freeze({
        ETheme,
        storageKey,

        getCurrentTheme() {
            return currentTheme;
        },

        getThemeList() {
            return Object.values(zpThemeController.ETheme);
        },

        changeTheme(target, callback) {
            if (toTheme(target) !== target) return;
            if (target === currentTheme) return;

            currentTheme = target;
            window.localStorage.setItem(storageKey, target);

            if (linkElement) linkElement.remove();

            linkElement = Object.assign(document.createElement("link"), {
                rel: "stylesheet",
                href: `assets/css/theme-${target}.css`,
            });

            document.querySelector("head").append(linkElement);

            if (typeof callback === "function") {
                callback();
            }
        },

        getChartsColor() {
            return ChartsColor[currentTheme];
        },
    });

    const ChartsColor = {
        [ETheme.Light]: [23, 124, 220],
        [ETheme.Dark]: [255, 255, 255],
    };

    let linkElement;
    let currentTheme;

    zpThemeController.changeTheme(
        toTheme(window.localStorage.getItem(storageKey)),
    );

    return zpThemeController;

    function toTheme(source) {
        return zpThemeController.getThemeList().indexOf(source) !== -1
            ? source
            : zpThemeController.ETheme.Light;
    }
})();
