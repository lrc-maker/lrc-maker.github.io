import { useLrc } from "../hooks/useLrc.js";
import { convertTimeToTag, stringify } from "../lrc-parser.js";
import { audioStatePubSub } from "../utils/audiomodule.js";
import { appContext } from "./app.context.js";
import { Home } from "./home.js";
import { AkariNotFound, AkariOangoLoading } from "./svg.img.js";
const { lazy, useContext, useEffect, useRef, useState } = React;
const LazyEditor = lazy(() => import("./editor.js").then(({ Eidtor }) => {
    return { default: Eidtor };
}));
const LazySynchronizer = lazy(() => import("./synchronizer.js").then(({ Synchronizer }) => {
    return { default: Synchronizer };
}));
const LazyGist = lazy(() => import("./gist.js").then(({ Gist }) => {
    return { default: Gist };
}));
const LazyPreferences = lazy(() => import("./preferences.js").then(({ Preferences }) => {
    return { default: Preferences };
}));
export const Content = () => {
    const self = useRef(Symbol(Content.name));
    const { prefState, trimOptions } = useContext(appContext, 4);
    const [path, setPath] = useState(location.hash);
    useEffect(() => {
        window.addEventListener("hashchange", () => {
            setPath(location.hash);
        });
    }, []);
    const [lrcState, lrcDispatch] = useLrc(() => {
        return {
            text: localStorage.getItem("lrc-maker-lyric") || "",
            options: trimOptions,
            select: Number.parseInt(sessionStorage.getItem("select-index"), 10) || 0,
        };
    });
    useEffect(() => {
        return audioStatePubSub.sub(self.current, (data) => {
            if (data.type === 1) {
                lrcDispatch({
                    type: 3,
                    payload: {
                        name: "length",
                        value: convertTimeToTag(data.payload, prefState.fixed, false),
                    },
                });
            }
        });
    }, [lrcDispatch, prefState.fixed]);
    useEffect(() => {
        const saveState = () => {
            lrcDispatch({
                type: 6,
                payload: (lrc) => {
                    localStorage.setItem("lrc-maker-lyric", stringify(lrc, prefState));
                    sessionStorage.setItem("select-index", lrc.selectIndex.toString());
                },
            });
            localStorage.setItem("lrc-maker-preferences", JSON.stringify(prefState));
        };
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                saveState();
            }
        });
        window.addEventListener("beforeunload", () => {
            saveState();
        });
    }, [lrcDispatch, prefState]);
    useEffect(() => {
        document.documentElement.addEventListener("drop", (ev) => {
            var _a;
            const file = (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
            if (file && (file.type.startsWith("text/") || /(?:\.lrc|\.txt)$/i.test(file.name))) {
                const fileReader = new FileReader();
                const onload = () => {
                    lrcDispatch({
                        type: 0,
                        payload: { text: fileReader.result, options: trimOptions },
                    });
                };
                fileReader.addEventListener("load", onload, {
                    once: true,
                });
                location.hash = "#/editor/";
                fileReader.readAsText(file, "utf-8");
            }
        });
    }, [lrcDispatch, trimOptions]);
    useEffect(() => {
        const rgb = hex2rgb(prefState.themeColor);
        document.documentElement.style.setProperty("--theme-rgb", rgb.join(", "));
        const lum = luminanace(...rgb);
        const con = lum + 0.05;
        const contrastColor = con * con > 0.0525 ? "var(--black)" : "var(--white)";
        document.documentElement.style.setProperty("--theme-contrast-color", contrastColor);
    }, [prefState.themeColor]);
    const content = (() => {
        switch (path) {
            case "#/editor/": {
                return React.createElement(LazyEditor, { lrcState: lrcState, lrcDispatch: lrcDispatch });
            }
            case "#/synchronizer/": {
                if (lrcState.lyric.length === 0) {
                    return React.createElement(AkariNotFound, null);
                }
                return React.createElement(LazySynchronizer, { state: lrcState, dispatch: lrcDispatch });
            }
            case "#/gist/": {
                return React.createElement(LazyGist, { lrcDispatch: lrcDispatch, langName: prefState.lang });
            }
            case "#/preferences/": {
                return React.createElement(LazyPreferences, null);
            }
        }
        return React.createElement(Home, null);
    })();
    return (React.createElement("main", { className: "app-main" },
        React.createElement(React.Suspense, { fallback: React.createElement(AkariOangoLoading, null) }, content)));
};
const luminanace = (...rgb) => {
    return rgb
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
        .reduce((p, c, i) => {
        return p + c * [0.2126, 0.7152, 0.0722][i];
    }, 0);
};
const hex2rgb = (hex) => {
    hex = hex.slice(1);
    const value = Number.parseInt(hex, 16);
    const r = (value >> 0x10) & 0xff;
    const g = (value >> 0x08) & 0xff;
    const b = (value >> 0x00) & 0xff;
    return [r, g, b];
};
//# sourceMappingURL=content.js.map