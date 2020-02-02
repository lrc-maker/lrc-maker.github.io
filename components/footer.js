import { audioRef, audioStatePubSub, currentTimePubSub } from "../utils/audiomodule.js";
import { isKeyboardElement } from "../utils/is-keyboard-element.js";
import { appContext } from "./app.context.js";
import { LrcAudio } from "./audio.js";
import { LoadAudio, nec } from "./loadaudio.js";
import { toastPubSub } from "./toast.js";
const { useCallback, useContext, useEffect, useReducer, useRef } = React;
const accept = ["audio/*", ".ncm", ".qmcflac", ".qmc0", ".qmc1", ".qmc2", ".qmc3", "qmcogg"].join(", ");
export const Footer = () => {
    const { prefState, lang } = useContext(appContext, 1 | 2);
    const [audioSrc, setAudioSrc] = useReducer((oldSrc, newSrc) => {
        URL.revokeObjectURL(oldSrc);
        return newSrc;
    }, undefined, () => {
        let src = sessionStorage.getItem("audio-src");
        if (src === null && location.search && URLSearchParams) {
            const searchParams = new URLSearchParams(location.search);
            const url = searchParams.get("url");
            if (url !== null) {
                return url;
            }
            const text = searchParams.get("text") || searchParams.get("title") || "";
            const result = /https?:\/\/\S+/.exec(text);
            src = result && nec(result[0]);
        }
        return src;
    });
    useEffect(() => {
        document.addEventListener("keydown", (ev) => {
            const { code, key, target } = ev;
            const codeOrKey = code || key;
            if (isKeyboardElement(target)) {
                return;
            }
            const ac = audioRef.current;
            if (!ac.src) {
                return;
            }
            if (ev.metaKey === true || ev.ctrlKey === true) {
                if (["ArrowUp", "KeyJ", "Up", "J", "j"].includes(codeOrKey)) {
                    ev.preventDefault();
                    const rate = ac.playbackRate;
                    const newRate = Math.exp(Math.min(Math.log(rate) + 0.2, 1));
                    ac.playbackRate = newRate;
                }
                else if (["ArrowDown", "KeyK", "Down", "K", "k"].includes(codeOrKey)) {
                    ev.preventDefault();
                    const rate = ac.playbackRate;
                    const newRate = Math.exp(Math.max(Math.log(rate) - 0.2, -1));
                    ac.playbackRate = newRate;
                }
                else if (codeOrKey === "Enter") {
                    ev.preventDefault();
                    audioRef.toggle();
                }
            }
            else {
                if (["ArrowLeft", "KeyA", "KeyH", "Left", "A", "a", "H", "h"].includes(codeOrKey)) {
                    ev.preventDefault();
                    ac.currentTime -= 5;
                }
                else if (["ArrowRight", "KeyD", "KeyL", "Right", "D", "d", "L", "l"].includes(codeOrKey)) {
                    ev.preventDefault();
                    ac.currentTime += 5;
                }
                else if (code === "KeyR" || key === "R" || key === "r") {
                    ev.preventDefault();
                    ac.playbackRate = 1;
                }
            }
        });
    }, []);
    useEffect(() => {
        document.documentElement.addEventListener("drop", (ev) => {
            const file = ev.dataTransfer.files[0];
            receiveFile(file, setAudioSrc);
        });
    }, []);
    const onAudioInputChange = useCallback((ev) => {
        const file = ev.target.files[0];
        receiveFile(file, setAudioSrc);
    }, []);
    const rafId = useRef(0);
    const onAudioLoadedMetadata = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        audioStatePubSub.pub({
            type: 1,
            payload: audioRef.duration,
        });
        toastPubSub.pub({
            type: "success",
            text: lang.notify.audioLoaded,
        });
    }, [lang]);
    const syncCurrentTime = useCallback(() => {
        currentTimePubSub.pub(audioRef.currentTime);
        rafId.current = requestAnimationFrame(syncCurrentTime);
    }, []);
    const onAudioPlay = useCallback(() => {
        rafId.current = requestAnimationFrame(syncCurrentTime);
        audioStatePubSub.pub({
            type: 0,
            payload: false,
        });
    }, [syncCurrentTime]);
    const onAudioPause = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        audioStatePubSub.pub({
            type: 0,
            payload: true,
        });
    }, []);
    const onAudioEnded = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        audioStatePubSub.pub({
            type: 0,
            payload: true,
        });
    }, []);
    const onAudioTimeUpdate = useCallback(() => {
        if (audioRef.paused) {
            currentTimePubSub.pub(audioRef.currentTime);
        }
    }, []);
    const onAudioRateChange = useCallback(() => {
        audioStatePubSub.pub({
            type: 2,
            payload: audioRef.playbackRate,
        });
    }, []);
    const onAudioError = useCallback((ev) => {
        const audio = ev.target;
        const error = audio.error;
        const message = lang.audio.error[error.code] || error.message || lang.audio.error[0];
        toastPubSub.pub({
            type: "warning",
            text: message,
        });
    }, [lang]);
    return (React.createElement("footer", { className: "app-footer" },
        React.createElement("input", { id: "audio-input", type: "file", accept: accept, hidden: true, onChange: onAudioInputChange }),
        React.createElement(LoadAudio, { setAudioSrc: setAudioSrc, lang: lang }),
        React.createElement("audio", { ref: audioRef, src: audioSrc, controls: prefState.builtInAudio, hidden: !prefState.builtInAudio, onLoadedMetadata: onAudioLoadedMetadata, onPlay: onAudioPlay, onPause: onAudioPause, onEnded: onAudioEnded, onTimeUpdate: onAudioTimeUpdate, onRateChange: onAudioRateChange, onError: onAudioError }),
        prefState.builtInAudio || React.createElement(LrcAudio, { lang: lang })));
};
const receiveFile = (file, setAudioSrc) => {
    sessionStorage.removeItem("audio-src");
    if (file) {
        if (file.type.startsWith("audio/")) {
            setAudioSrc(URL.createObjectURL(file));
            return;
        }
        if (file.name.endsWith(".ncm")) {
            const worker = new Worker("./ncmc-worker.js");
            worker.addEventListener("message", (ev) => {
                if (ev.data.type === "success") {
                    const dataArray = ev.data.payload;
                    const musicFile = new Blob([dataArray], {
                        type: detectMimeType(dataArray),
                    });
                    setAudioSrc(URL.createObjectURL(musicFile));
                }
                if (ev.data.type === "error") {
                    toastPubSub.pub({
                        type: "warning",
                        text: ev.data.payload,
                    });
                }
            }, { once: true });
            worker.addEventListener("error", (ev) => {
                toastPubSub.pub({
                    type: "warning",
                    text: ev.message,
                });
                worker.terminate();
            }, { once: true });
            worker.postMessage(file);
            return;
        }
        if (/\.qmc(?:flac|0|1|2|3)$/.test(file.name)) {
            const worker = new Worker("./qmc-worker.js");
            worker.addEventListener("message", (ev) => {
                if (ev.data.type === "success") {
                    const dataArray = ev.data.payload;
                    const musicFile = new Blob([dataArray], {
                        type: detectMimeType(dataArray),
                    });
                    setAudioSrc(URL.createObjectURL(musicFile));
                }
            }, { once: true });
            worker.postMessage(file);
            return;
        }
    }
};
const detectMimeType = (dataArray) => {
    const magicNumber = new DataView(dataArray.buffer).getUint32(0, false);
    switch (magicNumber) {
        case 1716281667:
            return "audio/flac";
        case 1332176723:
            return "audio/ogg";
        case 1380533830:
        case 1463899717:
            return "audio/wav";
        default:
            return "audio/mpeg";
    }
};
document.addEventListener("visibilitychange", () => {
    if (!audioRef.paused) {
        audioRef.toggle();
    }
});
//# sourceMappingURL=footer.js.map