"use strict";
((strProto) => {
    if (!strProto.trimStart) {
        strProto.trimStart =
            strProto.trimLeft ||
                function () {
                    return this.replace(/^\s+/, "");
                };
    }
    if (!strProto.trimEnd) {
        strProto.trimEnd =
            strProto.trimRight ||
                function () {
                    return this.replace(/\s+$/, "");
                };
    }
})(String.prototype);
//# sourceMappingURL=string.esnext.js.map