/**
 * Created by Rodrigo on 25/01/2017.
 */

"use strict";

var PolymerGlobalData = (function () {

    var instance;
    var data;
    var subscribers;

    /**
     * Notify to all the subscriber the new value.
     * A subscriber must implement a _set method or implement the PolymerGlobalVariableBehavior
     * @param path
     * @private
     */
    var _notify = function (path) {
        if (typeof data[path] != 'undefined' && typeof subscribers[path] != 'undefined')
            subscribers[path].forEach(function (subscriber) {
                subscriber._set(data[path]);
            });
    };

    var _init = function (initData) {

        data = initData || {}; //TODO Must be an object
        subscribers = {};

        //Public API
        return {
            get: function (path) {
                console.log("get: ", path);
                return data[path];
            },

            set: function (path, value) {
                console.log("set: ", path, value);
                if (data[path] != value) {
                    data[path] = value;
                    _notify(path);
                }
            },

            subscribe: function (path, subscriber) {
                console.log("subscribe: ", path, subscriber);
                subscribers[path] = subscribers[path] || [];
                subscribers[path].push(subscriber);
            },

            unsubscribe: function (path, subscriber) {
                console.log("unsubscribe: ", path, subscriber);
                if (typeof subscribers[path] != 'undefined') {
                    var index = subscribers[path].indexOf(subscriber);
                    if (index >= 0) subscribers[path].splice(index, 1);
                    if (subscribers[path].length === 0) delete subscribers[path];
                }
            },

            /**
             * If the element is subscribed, will return the path of the subscription. If not, will return `false`
             * @param subscriber
             * @returns {String | false}
             */
            isSubcribed: function (subscriber) {
                console.log("is subscribe: ", path);
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
            console.log("init: ", data);
            if (!instance) {
                instance = _init(data)
            }

            return instance;
        }
    };

})();


