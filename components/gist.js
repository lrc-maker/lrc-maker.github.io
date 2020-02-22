import { assignRepo, createRepo, getFils, getRepos, } from "../utils/gistapi.js";
import { appContext } from "./app.context.js";
import { AkariNotFound, AkariOangoLoading } from "./svg.img.js";
import { EditorSVG, GithubSVG, SynchronizerSVG } from "./svg.js";
import { toastPubSub } from "./toast.js";
const { useCallback, useContext, useEffect, useMemo, useState } = React;
const newTokenUrl = "https://github.com/settings/tokens/new?scopes=gist&description=https://lrc-maker.github.io";
const disableCheck = {
    autoCapitalize: "none",
    autoComplete: "off",
    autoCorrect: "off",
    spellCheck: false,
};
export const Gist = ({ lrcDispatch, langName }) => {
    const { lang, trimOptions } = useContext(appContext);
    const [token, setToken] = useState(() => localStorage.getItem("lrc-maker-oauth-token"));
    const [gistId, setGistId] = useState(() => localStorage.getItem("lrc-maker-gist-id"));
    const [gistIdList, setGistIdList] = useState(undefined);
    const [fileList, setFileList] = useState(() => JSON.parse(localStorage.getItem("lrc-maker-gist-file")));
    const ratelimit = useMemo(() => {
        return JSON.parse(sessionStorage.getItem("x-ratelimit"));
    }, []);
    const onSubmitToken = useCallback((ev) => {
        ev.preventDefault();
        const form = ev.target;
        const tokenInput = form.elements.namedItem("token");
        const value = tokenInput.value;
        localStorage.setItem("lrc-maker-oauth-token", value);
        setToken(value);
    }, []);
    const onCreateNewGist = useCallback(() => {
        createRepo()
            .then((json) => {
            localStorage.setItem("lrc-maker-gist-id", json.id);
            setGistId(json.id);
        })
            .catch((error) => {
            toastPubSub.pub({
                type: "warning",
                text: error.message,
            });
        });
    }, []);
    const onSubmitGistId = useCallback((ev) => {
        ev.preventDefault();
        const form = ev.target;
        const gistIdInput = form.elements.namedItem("gist-id");
        const value = gistIdInput.value;
        localStorage.setItem("lrc-maker-gist-id", value);
        setGistId(value);
        assignRepo().catch((error) => {
            toastPubSub.pub({
                type: "warning",
                text: error.message,
            });
        });
    }, []);
    useEffect(() => {
        if (gistId !== null || token === null) {
            return;
        }
        if (!("HTMLDataListElement" in window)) {
            return;
        }
        getRepos()
            .then((result) => {
            setGistIdList(result
                .filter((gist) => {
                return gist.description === "https://lrc-maker.github.io" && ".lrc-maker" in gist.files;
            })
                .map(({ id }) => id));
        })
            .catch((error) => {
            toastPubSub.pub({
                type: "warning",
                text: error.message,
            });
        });
    }, [token, gistId]);
    useEffect(() => {
        if (gistId === null) {
            return;
        }
        getFils()
            .then((result) => {
            if (result === null) {
                return;
            }
            const files = Object.values(result.files).filter((file) => file.filename.endsWith(".lrc"));
            localStorage.setItem("lrc-maker-gist-file", JSON.stringify(files, ["filename", "content", "truncated", "raw_url"]));
            setFileList(files);
        })
            .catch((error) => {
            toastPubSub.pub({
                type: "warning",
                text: error.message,
            });
        });
    }, [gistId]);
    const onFileLoad = useCallback((ev) => {
        const target = ev.target;
        if (!("key" in target.dataset)) {
            return;
        }
        const key = Number.parseInt(target.dataset.key, 10);
        const file = fileList === null || fileList === void 0 ? void 0 : fileList[key];
        if (!file) {
            return;
        }
        if (file.truncated) {
            fetch(file.raw_url)
                .then((res) => res.text())
                .then((text) => {
                lrcDispatch({
                    type: 0,
                    payload: { text, options: trimOptions },
                });
            })
                .catch((error) => {
                toastPubSub.pub({
                    type: "warning",
                    text: error.message,
                });
            });
        }
        else {
            lrcDispatch({
                type: 0,
                payload: { text: file.content, options: trimOptions },
            });
        }
    }, [fileList, lrcDispatch, trimOptions]);
    const onClear = useCallback(() => {
        setGistId(null);
        setToken(null);
    }, []);
    const RateLimit = useMemo(() => {
        if (ratelimit === null) {
            return false;
        }
        const RatelimitReset = new Intl.DateTimeFormat(langName, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        }).format(new Date(Number.parseInt(ratelimit["x-ratelimit-reset"], 10) * 1000));
        return (React.createElement("section", { className: "ratelimit" },
            React.createElement("p", null,
                "ratelimit-limit: ",
                ratelimit["x-ratelimit-limit"]),
            React.createElement("p", null,
                "ratelimit-remaining: ",
                ratelimit["x-ratelimit-remaining"]),
            React.createElement("p", null,
                "ratelimit-reset: ",
                RatelimitReset)));
    }, [ratelimit, langName]);
    const GistDetails = useCallback(() => {
        if (gistId !== null && token !== null) {
            return (React.createElement("details", { className: "gist-details" },
                React.createElement("summary", null, lang.gist.info),
                React.createElement("section", { className: "gist-bar" },
                    React.createElement("section", { className: "gist-info" },
                        React.createElement("p", null,
                            "Gist id: ",
                            React.createElement("a", { href: `https://gist.github.com/${gistId}`, target: "_blank", rel: "noopener noreferrer", className: "link" }, gistId)),
                        React.createElement("button", { className: "button", onClick: onClear }, lang.gist.clearTokenAndGist)),
                    RateLimit)));
        }
        return null;
    }, [gistId, token, lang.gist.info, lang.gist.clearTokenAndGist, onClear, RateLimit]);
    const NewToken = useMemo(() => {
        if (token === null) {
            return (React.createElement("section", { className: "new-token" },
                React.createElement(GithubSVG, null),
                React.createElement("p", { className: "new-token-tip-text" }, lang.gist.newTokenTip),
                React.createElement("a", { className: "new-token-tip button", target: "_blank", rel: "noopener noreferrer", href: newTokenUrl }, lang.gist.newTokenButton),
                React.createElement("form", { className: "new-token-form", onSubmit: onSubmitToken },
                    React.createElement("label", { htmlFor: "github-token" }, "Token:"),
                    React.createElement("input", Object.assign({ type: "text", className: "new-token-input", id: "github-token", name: "token", key: "token", minLength: 40, maxLength: 40, required: true }, disableCheck)),
                    React.createElement("input", { className: "new-token-submit button", type: "submit" }))));
        }
    }, [token, lang.gist.newTokenTip, lang.gist.newTokenButton, onSubmitToken]);
    const NewGistID = useMemo(() => {
        if (gistId === null) {
            const option = (id) => {
                return React.createElement("option", { key: id, value: id });
            };
            const gistIdDataList = gistIdList && (React.createElement("datalist", { id: "gist-list" },
                gistIdList.map((id) => option(id)),
                ";"));
            return (React.createElement("section", { className: "get-gist-id" },
                React.createElement(GithubSVG, null),
                React.createElement("p", { className: "gist-id-tip-text" }, lang.gist.newGistTip),
                React.createElement("button", { className: "create-new-gist button", onClick: onCreateNewGist }, lang.gist.newGistRepoButton),
                React.createElement("form", { className: "gist-id-form", onSubmit: onSubmitGistId },
                    React.createElement("label", { htmlFor: "gist-id" }, "Gist id:"),
                    React.createElement("input", Object.assign({ type: "text", className: "gist-id-input", id: "gist-id", name: "gist-id", key: "gist-id", list: "gist-list", placeholder: lang.gist.gistIdPlaceholder, required: true }, disableCheck)),
                    React.createElement("input", { className: "button", type: "submit" }),
                    gistIdDataList)));
        }
    }, [
        gistId,
        gistIdList,
        lang.gist.newGistTip,
        lang.gist.newGistRepoButton,
        lang.gist.gistIdPlaceholder,
        onCreateNewGist,
        onSubmitGistId,
    ]);
    const FileCardList = useMemo(() => {
        if (fileList !== null) {
            const FileCard = (file, index) => {
                return (React.createElement("article", { className: "file-item", key: file.raw_url },
                    React.createElement("section", { className: "file-content" }, file.content),
                    React.createElement("hr", null),
                    React.createElement("section", { className: "file-bar" },
                        React.createElement("span", { className: "file-title" }, file.filename),
                        React.createElement("span", { className: "file-action" },
                            React.createElement("a", { className: "file-load", href: "#/editor/", "data-key": index },
                                React.createElement(EditorSVG, null)),
                            React.createElement("a", { className: "file-load", href: "#/synchronizer/", "data-key": index },
                                React.createElement(SynchronizerSVG, null))))));
            };
            if (fileList.length === 0) {
                return (React.createElement("section", { className: "gist-no-data" },
                    React.createElement(AkariNotFound, null)));
            }
            return (React.createElement("section", { className: "file-list", onClick: onFileLoad }, fileList.map(FileCard)));
        }
    }, [fileList, onFileLoad]);
    return (React.createElement("div", { className: "gist" },
        React.createElement(GistDetails, null),
        NewToken || NewGistID || FileCardList || React.createElement(GistLoading, null)));
};
const GistLoading = () => {
    return (React.createElement("section", { className: "gist-loading" },
        React.createElement(AkariOangoLoading, null)));
};
//# sourceMappingURL=gist.js.map