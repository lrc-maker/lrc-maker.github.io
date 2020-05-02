import { guard } from "../hooks/useLrc.js";
import { convertTimeToTag, formatText } from "../lrc-parser.js";
import { audioRef, currentTimePubSub } from "../utils/audiomodule.js";
import { isKeyboardElement } from "../utils/is-keyboard-element.js";
import { appContext } from "./app.context.js";
import { AsidePanel } from "./asidepanel.js";
import { Curser } from "./curser.js";
const { useCallback, useContext, useEffect, useRef, useState } = React;
const SpaceButton = ({ sync }) => {
    return (React.createElement("button", { className: "space_button", onClick: sync }, "space"));
};
export const Synchronizer = ({ state, dispatch }) => {
    const self = useRef(Symbol(Synchronizer.name));
    const { selectIndex, currentIndex: highlightIndex } = state;
    const { prefState, lang } = useContext(appContext);
    useEffect(() => {
        dispatch({
            type: 3,
            payload: {
                name: "tool",
                value: `${lang.app.name} https://lrc-maker.github.io`,
            },
        });
    }, [dispatch, lang]);
    const [syncMode, setSyncMode] = useState(() => sessionStorage.getItem("sync-mode") === 1..toString() ? 1 : 0);
    useEffect(() => {
        sessionStorage.setItem("sync-mode", syncMode.toString());
    }, [syncMode]);
    const ul = useRef(null);
    const needScrollLine = {
        [0]: selectIndex,
        [1]: highlightIndex,
    }[syncMode];
    useEffect(() => {
        var _a;
        const line = (_a = ul.current) === null || _a === void 0 ? void 0 : _a.children[needScrollLine];
        if (line !== undefined) {
            line.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
    }, [needScrollLine]);
    useEffect(() => {
        return currentTimePubSub.sub(self.current, (time) => {
            dispatch({ type: 1, payload: time });
        });
    }, [dispatch]);
    const sync = useCallback(() => {
        if (!audioRef.duration) {
            return;
        }
        dispatch({
            type: 2,
            payload: audioRef.currentTime,
        });
    }, [dispatch]);
    useEffect(() => {
        const listener = (ev) => {
            const { code, key, target } = ev;
            const codeOrKey = code || key;
            if (isKeyboardElement(target)) {
                return;
            }
            if (codeOrKey === "Backspace" || codeOrKey === "Delete" || codeOrKey === "Del") {
                ev.preventDefault();
                dispatch({
                    type: 5,
                    payload: undefined,
                });
                return;
            }
            if (ev.metaKey === true || ev.ctrlKey === true) {
                return;
            }
            if (code === "Space" || key === " " || key === "Spacebar") {
                ev.preventDefault();
                sync();
            }
            else if (["ArrowUp", "KeyW", "KeyJ", "Up", "W", "w", "J", "j"].includes(codeOrKey)) {
                ev.preventDefault();
                dispatch({ type: 4, payload: (index) => index - 1 });
            }
            else if (["ArrowDown", "KeyS", "KeyK", "Down", "S", "s", "K", "k"].includes(codeOrKey)) {
                ev.preventDefault();
                dispatch({ type: 4, payload: (index) => index + 1 });
            }
            else if (codeOrKey === "Home") {
                ev.preventDefault();
                dispatch({ type: 4, payload: () => 0 });
            }
            else if (codeOrKey === "End") {
                ev.preventDefault();
                dispatch({ type: 4, payload: () => Infinity });
            }
            else if (codeOrKey === "PageUp") {
                ev.preventDefault();
                dispatch({ type: 4, payload: (index) => index - 10 });
            }
            else if (codeOrKey === "PageDown") {
                ev.preventDefault();
                dispatch({ type: 4, payload: (index) => index + 10 });
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [dispatch, sync]);
    const onLineClick = useCallback((ev) => {
        ev.stopPropagation();
        const target = ev.target;
        if (target.classList.contains("line")) {
            const lineKey = Number.parseInt(target.dataset.key, 10) || 0;
            dispatch({ type: 4, payload: () => lineKey });
        }
    }, [dispatch]);
    const onLineDoubleClick = useCallback((ev) => {
        ev.stopPropagation();
        if (!audioRef.duration) {
            return;
        }
        const target = ev.target;
        if (target.classList.contains("line")) {
            const key = Number.parseInt(target.dataset.key, 10);
            dispatch({
                type: 6,
                payload: ({ lyric }) => {
                    const time = lyric[key].time;
                    if (time !== undefined) {
                        audioRef.currentTime = guard(time, 0, audioRef.duration);
                    }
                },
            });
        }
    }, [dispatch]);
    const LyricLineIter = useCallback((line, index, lines) => {
        const select = index === selectIndex;
        const highlight = index === highlightIndex;
        const error = index > 0 && lines[index].time <= lines[index - 1].time;
        const className = Object.entries({
            line: true,
            select,
            highlight,
            error,
        })
            .reduce((p, [name, value]) => {
            if (value) {
                p.push(name);
            }
            return p;
        }, [])
            .join(" ");
        return (React.createElement(LyricLine, { key: index, index: index, className: className, line: line, select: select, prefState: prefState }));
    }, [selectIndex, highlightIndex, prefState]);
    const ulClassName = prefState.screenButton ? "lyric-list on-screen-button" : "lyric-list";
    return (React.createElement(React.Fragment, null,
        React.createElement("ul", { ref: ul, className: ulClassName, onClickCapture: onLineClick, onDoubleClickCapture: onLineDoubleClick }, state.lyric.map(LyricLineIter)),
        React.createElement(AsidePanel, { syncMode: syncMode, setSyncMode: setSyncMode, lrcDispatch: dispatch, prefState: prefState }),
        prefState.screenButton && React.createElement(SpaceButton, { sync: sync })));
};
const LyricLine = ({ line, index, select, className, prefState }) => {
    const lineTime = convertTimeToTag(line.time, prefState.fixed);
    const lineText = formatText(line.text, prefState.spaceStart, prefState.spaceEnd);
    return (React.createElement("li", { key: index, "data-key": index, className: className },
        select && React.createElement(Curser, { fixed: prefState.fixed }),
        React.createElement("time", { className: "line-time" }, lineTime),
        React.createElement("span", { className: "line-text" }, lineText)));
};
//# sourceMappingURL=synchronizer.js.map