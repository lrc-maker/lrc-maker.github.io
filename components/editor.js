import { stringify } from "../lrc-parser.js";
import { createFile } from "../utils/gistapi.js";
import { lrcFileName } from "../utils/lrc-file-name.js";
import { appContext } from "./app.context.js";
import { CloudUploadSVG, CopySVG, DownloadSVG, OpenFileSVG, UtilitySVG } from "./svg.js";
import { toastPubSub } from "./toast.js";
const { useCallback, useContext, useEffect, useMemo, useRef, useState } = React;
const disableCheck = {
    autoCapitalize: "none",
    autoComplete: "off",
    autoCorrect: "off",
    spellCheck: false,
};
const useDefaultValue = (defaultValue, ref) => {
    const or = (a, b) => a !== null && a !== void 0 ? a : b;
    const $ref = or(ref, useRef(null));
    useEffect(() => {
        if ($ref.current) {
            $ref.current.value = defaultValue;
        }
    }, [defaultValue, $ref]);
    return { ref: $ref, defaultValue };
};
export const Eidtor = ({ lrcState, lrcDispatch }) => {
    const { prefState, lang, trimOptions } = useContext(appContext);
    const parse = useCallback((ev) => {
        lrcDispatch({
            type: 0,
            payload: { text: ev.target.value, options: trimOptions },
        });
    }, [lrcDispatch, trimOptions]);
    const setInfo = useCallback((ev) => {
        const { name, value } = ev.target;
        lrcDispatch({
            type: 3,
            payload: { name, value },
        });
    }, [lrcDispatch]);
    const text = stringify(lrcState, prefState);
    const details = useRef(null);
    const onDetailsToggle = useCallback(() => {
        sessionStorage.setItem("editor-details-open", details.current.open.toString());
    }, []);
    const detailsOpened = useMemo(() => {
        return sessionStorage.getItem("editor-details-open") !== "false";
    }, []);
    const textarea = useRef(null);
    const [href, setHref] = useState(undefined);
    const onDownloadClick = useCallback(() => {
        setHref((url) => {
            if (url) {
                URL.revokeObjectURL(url);
            }
            return URL.createObjectURL(new Blob([textarea.current.value], {
                type: "text/plain;charset=UTF-8",
            }));
        });
    }, []);
    const onTextFileUpload = useCallback((ev) => {
        if (ev.target.files === null || ev.target.files.length === 0) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            lrcDispatch({
                type: 0,
                payload: { text: fileReader.result, options: trimOptions },
            });
        });
        fileReader.readAsText(ev.target.files[0], "UTF-8");
    }, [lrcDispatch, trimOptions]);
    const onCopyClick = useCallback(() => {
        var _a;
        (_a = textarea.current) === null || _a === void 0 ? void 0 : _a.select();
        document.execCommand("copy");
    }, []);
    const downloadName = useMemo(() => lrcFileName(lrcState.info), [lrcState.info]);
    const canSaveToGist = useMemo(() => {
        return localStorage.getItem("lrc-maker-oauth-token") !== null && localStorage.getItem("lrc-maker-gist-id") !== null;
    }, []);
    const onGistSave = useCallback(() => {
        setTimeout(() => {
            const name = prompt(lang.editor.saveFileName, downloadName);
            if (name) {
                createFile(name, textarea.current.value).catch((error) => {
                    toastPubSub.pub({
                        type: "warning",
                        text: error.message,
                    });
                });
            }
        }, 500);
    }, [downloadName, lang]);
    return (React.createElement("div", { className: "app-editor" },
        React.createElement("details", { ref: details, open: detailsOpened, onToggle: onDetailsToggle },
            React.createElement("summary", null, lang.editor.metaInfo),
            React.createElement("section", { className: "app-editor-infobox", onBlur: setInfo },
                React.createElement("label", { htmlFor: "info-ti" }, "[ti:"),
                React.createElement("input", Object.assign({ id: "info-ti", name: "ti", placeholder: lang.editor.title }, disableCheck, useDefaultValue(lrcState.info.get("ti") || ""))),
                React.createElement("label", { htmlFor: "info-ti" }, "]"),
                React.createElement("label", { htmlFor: "info-ar" }, "[ar:"),
                React.createElement("input", Object.assign({ id: "info-ar", name: "ar", placeholder: lang.editor.artist }, disableCheck, useDefaultValue(lrcState.info.get("ar") || ""))),
                React.createElement("label", { htmlFor: "info-ar" }, "]"),
                React.createElement("label", { htmlFor: "info-al" }, "[al:"),
                React.createElement("input", Object.assign({ id: "info-al", name: "al", placeholder: lang.editor.album }, disableCheck, useDefaultValue(lrcState.info.get("al") || ""))),
                React.createElement("label", { htmlFor: "info-al" }, "]"))),
        React.createElement("section", { className: "editor-tools" },
            React.createElement("label", { className: "editor-tools-item ripple", title: lang.editor.uploadText },
                React.createElement("input", { hidden: true, type: "file", accept: "text/*, .txt, .lrc", onChange: onTextFileUpload }),
                React.createElement(OpenFileSVG, null)),
            React.createElement("button", { className: "editor-tools-item ripple", title: lang.editor.copyText, onClick: onCopyClick },
                React.createElement(CopySVG, null)),
            React.createElement("a", { className: "editor-tools-item ripple", title: lang.editor.downloadText, href: href, onClick: onDownloadClick, download: downloadName },
                React.createElement(DownloadSVG, null)),
            React.createElement("a", { title: lang.editor.saveToGist, href: canSaveToGist ? undefined : "#/gist/", className: "editor-tools-item ripple", onClick: canSaveToGist ? onGistSave : undefined },
                React.createElement(CloudUploadSVG, null)),
            React.createElement("a", { title: lang.editor.utils, href: "/lrc-utils", className: "editor-tools-item ripple" },
                React.createElement(UtilitySVG, null))),
        React.createElement("textarea", Object.assign({ className: "app-textarea", "aria-label": "lrc input here", onBlur: parse }, disableCheck, useDefaultValue(text, textarea)))));
};
//# sourceMappingURL=editor.js.map