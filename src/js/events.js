let EventEmitter = (function () {
    let topics = {};
    return {
        subscribe: function (topic, listener) {
            if (!topics[topic]) {
                topics[topic] = {queue: []};
            }
            let index = topics[topic].queue.push(listener) - 1;
            return (function (t, i) {
                return {
                    remove: function () {
                        delete topics[t].queue[i];
                    }
                };
            })(topic, index);
        },
        publish: function (topic, info) {
            if (!topics[topic] || !topics[topic].queue.length) {
                return;
            }
            let items = topics[topic].queue;
            items.forEach(callback);
            function callback(item) {
                if (typeof item === "function") {
                    info = info === undefined ? {} : info;
                    item(info);
                }
            }
        }
    };
})();

export default EventEmitter;