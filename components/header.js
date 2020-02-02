import { appContext } from "./app.context.js";
import { CloudSVG, EditorSVG, HomeSVG, PreferencesSVG, SynchronizerSVG } from "./svg.js";
const { useContext } = React;
export const Header = () => {
    const { lang } = useContext(appContext, 1);
    return (React.createElement("header", { className: "app-header" },
        React.createElement("a", { id: "/", className: "app-title", title: lang.header.home, href: "#/" },
            React.createElement("span", { className: "app-title-text" }, lang.app.name),
            React.createElement("span", { className: "app-title-svg" },
                React.createElement(HomeSVG, null))),
        React.createElement("nav", { className: "app-nav" },
            React.createElement("a", { id: "/editor/", className: "app-tab", title: lang.header.editor, href: "#/editor/" },
                React.createElement(EditorSVG, null)),
            React.createElement("a", { id: "/synchronizer/", className: "app-tab", title: lang.header.synchronizer, href: "#/synchronizer/" },
                React.createElement(SynchronizerSVG, null)),
            React.createElement("a", { id: "/gist/", className: "app-tab", title: lang.header.gist, href: "#/gist/" },
                React.createElement(CloudSVG, null)),
            React.createElement("a", { id: "/preferences/", className: "app-tab", title: lang.header.preferences, href: "#/preferences/" },
                React.createElement(PreferencesSVG, null)))));
};
//# sourceMappingURL=header.js.map