import { audioStatePubSub } from "../utils/audiomodule.js";
import { CloseSVG } from "./svg.js";
const { useRef, useEffect, useCallback } = React;
export const loadAudioDialogRef = {
    current: null,
    get isOpen() {
        return this.current !== null && this.current.open;
    },
    open() {
        if (this.current === null || this.current.open) {
            return;
        }
        this.current.open = true;
    },
    close() {
        if (this.current === null || !this.current.open) {
            return;
        }
        this.current.open = false;
    },
};
export const LoadAudio = ({ setAudioSrc, lang }) => {
    const self = useRef(Symbol(LoadAudio.name));
    useEffect(() => {
        return audioStatePubSub.sub(self.current, (data) => {
            if (data.type === 1) {
                loadAudioDialogRef.close();
            }
        });
    }, []);
    const onToggle = useCallback(() => {
        const onEscapeKeyDown = (ev) => {
            if (ev.code === "Escape" || ev.key === "Escape") {
                loadAudioDialogRef.close();
            }
        };
        if (loadAudioDialogRef.isOpen) {
            window.addEventListener("keydown", onEscapeKeyDown);
        }
        else {
            window.removeEventListener("keydown", onEscapeKeyDown);
        }
    }, []);
    const onSubmit = useCallback((ev) => {
        ev.preventDefault();
        const form = ev.target;
        const urlInput = form.elements.namedItem("url");
        const url = nec(urlInput.value);
        sessionStorage.setItem("audio-src", url);
        setAudioSrc(url);
    }, [setAudioSrc]);
    const onFocus = useCallback((ev) => {
        ev.target.select();
    }, []);
    return ReactDOM.createPortal(React.createElement("details", { ref: loadAudioDialogRef, className: "dialog fixed loadaudio-dialog", onToggle: onToggle },
        React.createElement("summary", { className: "dialog-close" },
            React.createElement(CloseSVG, null)),
        React.createElement("section", { className: "dialog-body loadaudio-body" },
            React.createElement("div", { className: "loadaudio-tab loadaudio-via-file" },
                React.createElement("input", { type: "radio", name: "tabgroup", id: "tab-file", defaultChecked: true }),
                React.createElement("label", { className: "ripple", htmlFor: "tab-file" }, lang.loadAudio.file),
                React.createElement("div", { className: "loadaudio-content" },
                    React.createElement("label", { className: "audio-input-tip", htmlFor: "audio-input" }, lang.loadAudio.loadFile))),
            React.createElement("div", { className: "loadaudio-tab loadaudio-via-url" },
                React.createElement("input", { type: "radio", name: "tabgroup", id: "tab-url" }),
                React.createElement("label", { className: "ripple", htmlFor: "tab-url" }, lang.loadAudio.url),
                React.createElement("div", { className: "loadaudio-content" },
                    React.createElement("form", { className: "audio-input-form", onSubmit: onSubmit },
                        React.createElement("input", { type: "url", name: "url", required: true, autoCapitalize: "none", autoComplete: "off", autoCorrect: "off", spellCheck: false, onFocus: onFocus }),
                        React.createElement("input", { className: "button", type: "submit" })))))), document.body);
};
export const nec = (url) => {
    if (url.includes("music.163.com")) {
        const result = url.match(/\d{4,}/);
        if (result !== null) {
            const id = result[0];
            return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        }
    }
    return url;
};
//# sourceMappingURL=loadaudio.js.map