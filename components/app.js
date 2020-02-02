import { AppProvider } from "./app.context.js";
import { Content } from "./content.js";
import { Footer } from "./footer.js";
import { Header } from "./header.js";
import { Toast } from "./toast.js";
export const App = () => {
    return (React.createElement(AppProvider, null,
        React.createElement(Header, null),
        React.createElement(Content, null),
        React.createElement(Footer, null),
        React.createElement(Toast, null)));
};
//# sourceMappingURL=app.js.map