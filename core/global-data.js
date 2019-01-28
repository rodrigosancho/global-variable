/**
 * Created by Rodrigo on 25/01/2017.
 */
const data = {};
const subscribers = {};
const EVENTS = {
    SET: 'set',
    SUBSCRIBE : 'subscribe',
    UNSUBSCRIBE: 'unsubscribe'
};

/**
 * Notify to all the subscriber the new value.
 * A subscriber must implement a _onEvent method.
 * @param event
 * @param detail
 * @param path
 * @private
 */
const _notify = (event, detail, path = '') => {
    // This method will notify to elements subscribed to the path,
    // as well as the element who are subscribed to every single action, as the global-data element.
    const pathSubscribers = subscribers[path] || [];
    const wildCardSubscribers = subscribers['*'] || [];

    [...pathSubscribers, ...wildCardSubscribers].forEach(subscriber => {
        subscriber._onEvent(event, detail);
    });
};

const _addSubscriber = (path, subscriber) => {
    subscribers[path] = subscribers[path] || [];
    subscribers[path].push(subscriber);
};

const _deleteSubscriber = (path, subscriber) => {
    const index = subscribers[path].indexOf(subscriber);
    if (index >= 0) subscribers[path].splice(index, 1);
    if (subscribers[path].length === 0) delete subscribers[path];
};

const get = path => data[path];

const set = (path, value) => {
    if (data[path] === value) {
        return
    }

    const { SET } = EVENTS;
    data[path] = value;
    _notify(SET, {
        path,
        value
    }, path);
};

const subscribe = (path, subscriber) => {
    const { SUBSCRIBE } = EVENTS;
    _addSubscriber(path, subscriber)
    _notify(SUBSCRIBE, {
        path,
        element: subscriber
    })
};

const unsubscribe = (path, subscriber) => {
    if (!subscribers[path]) {
        return
    }

    const { UNSUBSCRIBE } = EVENTS;
    _deleteSubscriber(path, subscriber);
    _notify(UNSUBSCRIBE, {
        path,
        element: subscriber
    });
};

/**
 * If the element is subscribed, will return the path of the subscription. If not, will return `false`
 * @param subscriber
 * @returns {String | false}
 */
const isSubcribed = subscriber =>
    Object
        .entries(subscribers)
        .reduce((acc, [path, subs]) =>
            subs.contains(subscriber) ? path : acc
        , false)

export default {
    EVENTS,
    get,
    set,
    subscribe,
    unsubscribe,
    isSubcribed
};




