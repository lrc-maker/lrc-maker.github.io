const filenamify = (name) => {
    return name.replace(/[<>:"/\\|?*]/g, "_").trim();
};
export const lrcFileName = (lrcInfo) => {
    const list = [lrcInfo.get("ti"), lrcInfo.get("ar")].filter((v) => !!v);
    if (list.length === 0) {
        if (lrcInfo.has("al")) {
            list.push(lrcInfo.get("al"));
        }
        list.push(new Date().toLocaleString());
    }
    return list.map((name) => filenamify(name)).join(" - ") + ".lrc";
};
//# sourceMappingURL=lrc-file-name.js.map