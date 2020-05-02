import { useLang } from "../hooks/useLang.js";
import { usePref } from "../hooks/usePref.js";
import { toastPubSub } from "./toast.js";
const { createContext, useEffect, useMemo } = React;
export const appContext = createContext(undefined, (prev, next) => {
    let bits = 0;
    if (prev.lang !== next.lang) {
        bits |= 1;
    }
    if (prev.prefState.builtInAudio !== next.prefState.builtInAudio) {
        bits |= 2;
    }
    if (prev.prefState !== next.prefState) {
        bits |= 4;
    }
    return bits;
});
export const AppProvider = ({ children }) => {
    const [prefState, prefDispatch] = usePref(() => localStorage.getItem("lrc-maker-preferences") || "");
    const [lang, setLang] = useLang();
    useEffect(() => {
        setLang(prefState.lang).catch((error) => {
            toastPubSub.pub({
                type: "warning",
                text: error.message,
            });
        });
    }, [prefState.lang, setLang]);
    useEffect(() => {
        document.title = lang.app.fullname;
        document.documentElement.lang = prefState.lang;
    }, [lang, prefState, prefState.lang]);
    const value = useMemo(() => {
        return {
            lang,
            prefState,
            prefDispatch,
            trimOptions: {
                trimStart: prefState.spaceStart >= 0,
                trimEnd: prefState.spaceEnd >= 0,
            },
        };
    }, [lang, prefDispatch, prefState]);
    return React.createElement(appContext.Provider, { value: value }, children);
};
//# sourceMappingURL=app.context.js.map