import { createPubSub } from "./pubsub.js";
export const audioRef = {
    current: null,
    get src() {
        var _a, _b;
        return (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.src) !== null && _b !== void 0 ? _b : "";
    },
    get duration() {
        var _a, _b;
        return (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 0;
    },
    get paused() {
        var _a, _b;
        return (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.paused) !== null && _b !== void 0 ? _b : true;
    },
    get playbackRate() {
        var _a, _b;
        return (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.playbackRate) !== null && _b !== void 0 ? _b : 1;
    },
    set playbackRate(rate) {
        if (this.current !== null) {
            this.current.playbackRate = rate;
        }
    },
    get currentTime() {
        var _a, _b;
        return (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.currentTime) !== null && _b !== void 0 ? _b : 0;
    },
    set currentTime(time) {
        if (this.current !== null && this.current.duration !== 0) {
            this.current.currentTime = time;
        }
    },
    toggle() {
        var _a;
        if ((_a = this.current) === null || _a === void 0 ? void 0 : _a.duration) {
            this.current.paused ? this.current.play() : this.current.pause();
        }
    },
};
export const audioStatePubSub = createPubSub();
export const currentTimePubSub = createPubSub();
//# sourceMappingURL=audiomodule.js.map