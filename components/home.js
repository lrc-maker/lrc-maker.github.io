import { isKeyboardElement } from "../utils/is-keyboard-element.js";
import { appContext } from "./app.context.js";
import { loadAudioDialogRef } from "./loadaudio.js";
import { EditorSVG, LoadAudioSVG, SynchronizerSVG } from "./svg.js";
const { useContext } = React;
export const Home = () => {
    const { lang } = useContext(appContext);
    const onLoadAudioDialogOpen = () => {
        loadAudioDialogRef.open();
    };
    return (React.createElement("div", { className: "home" },
        React.createElement("p", { className: "home-tip home-tip-top-left" }, lang.home.tipTopLeft),
        React.createElement("p", { className: "home-tip home-tip-top-right" }, lang.home.tipTopRight),
        React.createElement("p", { className: "home-tip home-tip-bottom-left" }, lang.home.tipBottomLeft),
        React.createElement("p", { className: "home-tip home-tip-bottom-right" }, lang.home.tipBottomRight),
        React.createElement("section", { className: "home-tip-section" },
            React.createElement("p", null, lang.home.tips),
            React.createElement("ol", null,
                React.createElement("li", null,
                    React.createElement("a", { className: "home-tip-item", href: "#/editor/" },
                        React.createElement(EditorSVG, null),
                        React.createElement("span", { className: "home-tip-text" }, lang.home.tipForLyricText))),
                React.createElement("li", null,
                    React.createElement("span", { className: "home-tip-item", onClick: onLoadAudioDialogOpen },
                        React.createElement(LoadAudioSVG, null),
                        React.createElement("span", { className: "home-tip-text" }, lang.home.tipForUploadAudio))),
                React.createElement("li", null,
                    React.createElement("a", { className: "home-tip-item", href: "#/synchronizer/" },
                        React.createElement(SynchronizerSVG, null),
                        React.createElement("span", { className: "home-tip-text" }, lang.home.tipForSynchronizer)))))));
};
document.addEventListener("keydown", (ev) => {
    const { code, key, target } = ev;
    if (isKeyboardElement(target)) {
        return;
    }
    if (key === "?" || (code === "Slash" && ev.shiftKey)) {
        location.hash = "#/";
    }
});
//# sourceMappingURL=home.js.map