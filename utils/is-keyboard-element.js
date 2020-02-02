export const isKeyboardElement = (element) => {
    if (element === null) {
        return false;
    }
    const type = element.type;
    return type === "textarea" || type === "text" || type === "url";
};
//# sourceMappingURL=is-keyboard-element.js.map