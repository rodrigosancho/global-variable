/**
`<global-data></global-data>`

[Polymer element](https://www.polymer-project.org/1.0/) that works as an API for the storage with two methods, `set(path, value)` and `get(path)`.
This element will, as well, fire events every time that a path's value changes,
an element subscribe to a path or an element unsubscribe from a path.

    <global-data id="globalData"
                 on-set="_onSet"
                 on-subscribe="_onSubscribe"
                 on-unsubscribe="_onUnsubscribe">
    </global-data>

    <global-variable key="input"
                     value="{{ inputElement1 }}">
    </global-variable>
    <paper-input label="Element 1"
                 value="{{ inputElement1 }}">
    </paper-input>

    <script>
          var data = document.querySelector('#globalData');
          console.log(data.get('input')); //Will show paper-input's value
    </script>

@demo demo/index.html
*/

import '@polymer/polymer/polymer-element.js';

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
 * `global-data`
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class GlobalData extends PolymerElement {
  static get properties() {
    return {

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

  /**
   * Fired when a path `path` changes its value.
   * @event set
   * @param {String} path  Path inside the storage
   * @param {String} value New value of the path.
   *
   */
  /**
   * Fired when a new `element` subscribe to a storage path.
   * @event subscribe
   * @param {String} path  Path inside the storage
   * @param {Node} element Html node of the new subscriber.
   */

  /** Fired when a new `element` unsubscribe from a storage path.
   * @event set
   * @param {String} path  Path inside the storage
   * @param {Node} element Html node of the old subscriber.
   */

  created(){
    globalData.subscribe('*', this);
  }

  detached() {
    globalData.unsubscribe('*', this);
  }

  _onEvent (event, detail){
    this.fire(event, detail);
  }

  set(path, value){
    globalData.set(path, value);
  }

  get(path){
    return globalData.get(path);
  }
}

customElements.define('global-data', GlobalData);