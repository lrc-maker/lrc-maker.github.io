import { convertTimeToTag } from "../lrc-parser.js";
import { audioRef, audioStatePubSub, currentTimePubSub } from "../utils/audiomodule.js";
import { loadAudioDialogRef } from "./loadaudio.js";
import { Forward5sSVG, LoadAudioSVG, PauseSVG, PlaySVG, Replay5sSVG } from "./svg.js";
const { useState, useEffect, useRef, useCallback, useMemo } = React;
const Slider = ({ min, max, step, value, onInput, className }) => {
    const total = max - min || 1;
    const percent = (value - min) / total;
    return (React.createElement("div", { className: `slider ${className}-slider` },
        React.createElement("progress", { value: percent }),
        React.createElement("input", { type: "range", className: className, "aria-label": className, min: min, max: max, step: step, value: value, onInput: onInput })));
};
const TimeLine = ({ duration, paused }) => {
    const self = useRef(Symbol(TimeLine.name));
    const [currentTime, setCurrentTime] = useState(audioRef.currentTime);
    const [rate, setRate] = useState(audioRef.playbackRate);
    useEffect(() => {
        return audioStatePubSub.sub(self.current, (data) => {
            if (data.type === 2) {
                setRate(data.payload);
            }
        });
    }, []);
    useEffect(() => {
        if (paused) {
            return currentTimePubSub.sub(self.current, (data) => {
                setCurrentTime(data);
            });
        }
        else {
            const id = setInterval(() => {
                setCurrentTime(audioRef.currentTime);
            }, 500 / rate);
            return () => {
                clearInterval(id);
            };
        }
    }, [paused, rate]);
    const rafId = useRef(0);
    const onInput = useCallback((ev) => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }
        const value = ev.target.value;
        rafId.current = requestAnimationFrame(() => {
            const time = Number.parseInt(value, 0);
            setCurrentTime(time);
            audioRef.currentTime = time;
        });
    }, []);
    const durationTimeTag = useMemo(() => {
        return duration ? " / " + convertTimeToTag(duration, 0, false) : false;
    }, [duration]);
    return (React.createElement(React.Fragment, null,
        React.createElement("time", null,
            convertTimeToTag(currentTime, 0, false),
            durationTimeTag),
        React.createElement(Slider, { min: 0, max: duration, step: 1, value: currentTime, className: "timeline", onInput: onInput })));
};
const RateSlider = ({ lang }) => {
    const self = useRef(Symbol(RateSlider.name));
    const [playbackRate, setPlaybackRate] = useState(audioRef.playbackRate);
    useEffect(() => {
        return audioStatePubSub.sub(self.current, (data) => {
            if (data.type === 2) {
                setPlaybackRate(data.payload);
            }
        });
    }, []);
    const playbackRateSliderValue = useMemo(() => {
        return Math.log(playbackRate);
    }, [playbackRate]);
    const onPlaybackRateChange = useCallback((ev) => {
        const value = Math.exp(Number.parseFloat(ev.target.value));
        setPlaybackRate(value);
        audioRef.playbackRate = value;
    }, []);
    const onPlaybackRateReset = useCallback(() => {
        audioRef.playbackRate = 1;
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "ripple glow", title: lang.audio.resetRate, onClick: onPlaybackRateReset },
            "X ",
            playbackRate.toFixed(2)),
        React.createElement(Slider, { className: "playbackrate", min: -1, max: 1, step: "any", value: playbackRateSliderValue, onInput: onPlaybackRateChange })));
};
export const LrcAudio = ({ lang }) => {
    const self = useRef(Symbol(LrcAudio.name));
    const [paused, setPaused] = useState(audioRef.paused);
    const [duration, setDuration] = useState(audioRef.duration);
    useEffect(() => {
        return audioStatePubSub.sub(self.current, (data) => {
            switch (data.type) {
                case 1: {
                    setDuration(data.payload);
                    setPaused(audioRef.paused);
                    break;
                }
                case 0: {
                    setPaused(data.payload);
                    break;
                }
            }
        });
    }, []);
    const onReplay5s = useCallback(() => {
        audioRef.currentTime -= 5;
    }, []);
    const onForward5s = useCallback(() => {
        audioRef.currentTime += 5;
    }, []);
    const onPlayPauseToggle = useCallback(() => {
        audioRef.toggle();
    }, []);
    const onLoadAudioButtonClick = useCallback(() => {
        loadAudioDialogRef.open();
    }, []);
    return (React.createElement("section", { className: "lrc-audio" + (paused ? "" : " playing") },
        React.createElement("button", { className: "ripple glow loadaudio-button", title: lang.audio.loadAudio, onClick: onLoadAudioButtonClick },
            React.createElement(LoadAudioSVG, null)),
        React.createElement("button", { className: "ripple glow", title: lang.audio.replay5s, onClick: onReplay5s, disabled: !duration },
            React.createElement(Replay5sSVG, null)),
        React.createElement("button", { className: "ripple glow", title: paused ? lang.audio.play : lang.audio.pause, disabled: !duration, onClick: onPlayPauseToggle }, paused ? React.createElement(PlaySVG, null) : React.createElement(PauseSVG, null)),
        React.createElement("button", { className: "ripple glow", title: lang.audio.forward5s, onClick: onForward5s, disabled: !duration },
            React.createElement(Forward5sSVG, null)),
        React.createElement(TimeLine, { duration: duration, paused: paused }),
        React.createElement(RateSlider, { lang: lang })));
};
//# sourceMappingURL=audio.js.map