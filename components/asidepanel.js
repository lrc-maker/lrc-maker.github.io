import { stringify } from "../lrc-parser.js";
import { lrcFileName } from "../utils/lrc-file-name.js";
import { DownloadSVG, LockSVG } from "./svg.js";
const { useState, useCallback } = React;
export const AsidePanel = React.memo(({ syncMode, setSyncMode, lrcDispatch, prefState }) => {
    const [href, setHref] = useState();
    const [name, setName] = useState();
    const onSyncModeToggle = useCallback(() => {
        setSyncMode((syncMode) => (syncMode === 0 ? 1 : 0));
    }, [setSyncMode]);
    const onDownloadClick = useCallback(() => {
        lrcDispatch({
            type: 6,
            payload: (state) => {
                const text = stringify(state, prefState);
                setHref((url) => {
                    if (url) {
                        URL.revokeObjectURL(url);
                    }
                    return URL.createObjectURL(new Blob([text], {
                        type: "text/plain;charset=UTF-8",
                    }));
                });
                setName(lrcFileName(state.info));
            },
        });
    }, [lrcDispatch, prefState]);
    const mode = syncMode === 0 ? "select" : "highlight";
    const className = ["aside-button", "syncmode-button", "ripple", "glow ", mode].join(" ");
    return (React.createElement("aside", { className: "aside-panel" },
        React.createElement("button", { className: className, onClick: onSyncModeToggle, "aria-label": `${mode} mode` },
            React.createElement(LockSVG, null)),
        React.createElement("a", { href: href, download: name, className: "aside-button ripple glow", onClick: onDownloadClick },
            React.createElement(DownloadSVG, null))));
});
AsidePanel.displayName = AsidePanel.name;
//# sourceMappingURL=asidepanel.js.map