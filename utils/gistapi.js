const apiUrl = "https://api.github.com/gists";
export const getRepos = async () => {
    const token = localStorage.getItem("lrc-maker-oauth-token");
    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
        },
        mode: "cors",
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
};
export const createRepo = async () => {
    const token = localStorage.getItem("lrc-maker-oauth-token");
    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `token ${token}`,
        },
        body: JSON.stringify({
            description: "https://lrc-maker.github.io",
            public: true,
            files: {
                [".lrc-maker"]: { content: "This file is used to be tracked and identified by https://lrc-maker.github.io" },
            },
        }),
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
};
export const assignRepo = async () => {
    const token = localStorage.getItem("lrc-maker-oauth-token");
    const id = localStorage.getItem("lrc-maker-gist-id");
    const res = await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `token ${token}`,
        },
        body: JSON.stringify({
            description: "https://lrc-maker.github.io",
            files: {
                [".lrc-maker"]: { content: "This file is used to be tracked and identified by https://lrc-maker.github.io" },
            },
        }),
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
};
export const getFils = async () => {
    const token = localStorage.getItem("lrc-maker-oauth-token");
    const id = localStorage.getItem("lrc-maker-gist-id");
    const etag = localStorage.getItem("lrc-maker-gist-etag");
    const res = await fetch(`${apiUrl}/${id}`, {
        headers: {
            "Authorization": `token ${token}`,
            "If-None-Match": etag,
        },
    });
    if (!res.ok) {
        if (res.status >= 400) {
            throw await res.json();
        }
    }
    localStorage.setItem("lrc-maker-gist-etag", res.headers.get("etag"));
    const ratelimit = {
        "x-ratelimit-limit": res.headers.get("x-ratelimit-limit"),
        "x-ratelimit-remaining": res.headers.get("x-ratelimit-remaining"),
        "x-ratelimit-reset": res.headers.get("x-ratelimit-reset"),
    };
    sessionStorage.setItem("x-ratelimit", JSON.stringify(ratelimit));
    return res.status === 200 ? res.json() : null;
};
export const createFile = async (fileName, content) => {
    const token = localStorage.getItem("lrc-maker-oauth-token");
    const id = localStorage.getItem("lrc-maker-gist-id");
    const res = await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `token ${token}`,
        },
        body: JSON.stringify({
            files: {
                [fileName]: { content },
            },
        }),
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
};
//# sourceMappingURL=gistapi.js.map