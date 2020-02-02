export const createPubSub = () => {
    const bus = new Map();
    const pub = (data) => {
        bus.forEach((cb) => cb(data));
    };
    const sub = (id, cb) => {
        bus.set(id, cb);
        return () => {
            bus.delete(id);
        };
    };
    return { pub, sub };
};
//# sourceMappingURL=pubsub.js.map