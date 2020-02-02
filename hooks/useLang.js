import { language as enUS } from "../languages/en-US.js";
export const useLang = () => {
    const [value, setValue] = React.useState(enUS);
    const setLang = async (langCode) => {
        const { language } = (await import(`../languages/${langCode}.js`));
        setValue(language);
    };
    return [value, React.useCallback((lang) => setLang(lang), [])];
};
//# sourceMappingURL=useLang.js.map