/**
`<global-variable>`

[Polymer element](https://www.polymer-project.org/1.0/) that allows share data between non-relatives elements.

You can instance this element as many times as you desire.
Every time that an instance's `value` is modified, it will be propagated to the rest of the
instances of this element with the same `key`.
 ```html
  <global-variable key="input"
                   value="{{ inputElement1 }}"></global-variable>
  <paper-input label="Element 1"
               value="{{ inputElement1 }}"></paper-input>

  <global-variable key="input"
                   value="{{ inputElement2 }}"></global-variable>
  <paper-input label="Element 2"
               value="{{ inputElement2 }}"></paper-input>
```
Both input will show the same value

@demo demo/index.html 
*/

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


var globalData = PolymerGlobalData.init();

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `global-variable` Allows share data between non-related elements
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class GlobalVariable extends PolymerElement {
  static get properties() {
    return {
      _notify : {
        type: Function,
        computed: '_notifyOrigin(key, readonly)'
      },

      /** Key to subscribe */
      key: {
        type: String,
        reflectToAttribute: true,
        observer: '_subscribe'
      },

      /** Current value of the element. If the element is subscribed to a key, this param is as well,
       * the current value for the key */
      value: {
        notify: true,
        observer: '_notify'
      },

      /** Readonly elements, will not propagate any possible value change to the rest of the subscribers */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  static get template() {
      return html`
      <style>
        :host {
          display: none;
        }
      </style>
      `;
  }

  ready() {
    globalData = PolymerGlobalData.init();
  }

  detached() {
    globalData.unsubscribe(this.key, this);
  }

  _notifyOrigin(key, readonly) {
    return function (newValue, oldValue){
      if (!readonly) globalData.set(key, newValue);
    }
  }

  _subscribe(newKey, oldKey) {
    if (newKey != oldKey && oldKey)
      globalData.unsubscribe(oldKey, this);

    globalData.subscribe(newKey, this);
    this.set('value', globalData.get(newKey));
  }

  _onEvent(event, detail){
    if(event === 'set') this._set(detail)
  }

  _set(value){
    this.set('value', value.value);
  }
}

customElements.define('global-variable', GlobalVariable);
