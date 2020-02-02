import { App } from "./components/app.js";
if ("scrollBehavior" in document.documentElement.style) {
}
else {
    import("./polyfill/smooth-scroll.js");
}
ReactDOM.render(React.createElement(App), document.querySelector(".app-container"), () => {
    document.querySelector(".page-loading").remove();
    window.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
    });
    window.addEventListener("drop", (ev) => {
        ev.preventDefault();
    });
});
//# sourceMappingURL=index.js.map