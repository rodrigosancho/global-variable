/**
 * Created by Rodrigo on 25/01/2017.
 */

"use strict";

var PolymerGlobalData = (function () {

    var instance,
        data,
        subscribers;

    /**
     * Notify to all the subscriber the new value.
     * A subscriber must implement a _onEvent method.
     * @param event
     * @param detail
     * @param path
     * @private
     */
    var _notify = function (event, detail, path) {
        // This method will notify to elements subscribed to the path,
        // as well as the element who are subscribed to every single action, as the global-data element.
        var subscribersToNotify = [];

        if(typeof subscribers['*'] != 'undefined')
            subscribersToNotify = subscribersToNotify.concat(subscribers['*']);

        if(typeof path != 'undefined' && typeof subscribers[path] != 'undefined')
            subscribersToNotify = subscribersToNotify.concat(subscribers[path]);

        subscribersToNotify.forEach(function (subscriber) {
            subscriber._onEvent(event, detail);
        });
    };

    var _init = function (initData) {

        data = initData || {}; //TODO Must be an object
        subscribers = {};

        //Public API
        return {
            get: function (path) {
                return data[path];
            },

            set: function (path, value) {
                if (data[path] != value) {
                    data[path] = value;
                    _notify('set', {
                        path: path,
                        value: value
                    }, path);
                }
            },

            subscribe: function (path, subscriber) {
                subscribers[path] = subscribers[path] || [];
                subscribers[path].push(subscriber);
                _notify('subscribe', {
                    path: path,
                    element: subscriber
                })
            },

            unsubscribe: function (path, subscriber) {
                if (typeof subscribers[path] != 'undefined') {
                    var index = subscribers[path].indexOf(subscriber);
                    if (index >= 0) subscribers[path].splice(index, 1);
                    if (subscribers[path].length === 0) delete subscribers[path];
                    _notify('unsubscribe', {
                        path: path,
                        element: subscriber
                    });
                }
            },

            /**
             * If the element is subscribed, will return the path of the subscription. If not, will return `false`
             * @param subscriber
             * @returns {String | false}
             */
            isSubcribed: function (subscriber) {
                for (var prop in subscribers) {
                    if (subscribers.hasOwnProperty(prop)
                        && subscribers[prop].indexOf(subscriber) >= 0)
                        return prop;
                }
                return false;
            }
        }
    };

    return {
        /**
         * Initiates the only object that can be loaded.
         * This singleton pattern allow to share data between all the instances
         * @param data {Object} Initial data
         * @returns {*}
         */
        init: function (data) {
            if (!instance) {
                instance = _init(data)
            }

            return instance;
        }
    };

})();


