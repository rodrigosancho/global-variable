import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import globalData from "./core/global-data";

/**
 * `<global-data></global-data>`
 *
 * [Polymer element](https://www.polymer-project.org/3.0/) that works as an API for the storage with two methods, `set(path, value)` and `get(path)`.
 * This element will, as well, fire events every time that a path's value changes,
 * an element subscribe to a path or an element unsubscribe from a path.
 * ```html
 *  <global-data id="globalData"
 *              on-set="_onSet"
 *              on-subscribe="_onSubscribe"
 *              on-unsubscribe="_onUnsubscribe">
 *   </global-data>
 *
 *  <global-variable key="input"
 *                  value="{{ inputElement1 }}">
 *  </global-variable>
 *  <paper-input label="Element 1"
 *              value="{{ inputElement1 }}">
 *  </paper-input>
 *
 *  <script>
 *      var data = document.querySelector('#globalData');
 *      console.log(data.get('input')); //Will show paper-input's value
 *  </script>
 * ```
 * @demo demo/index.html
 * @customElement
 * @polymer
 *
 */
class GlobalData extends PolymerElement {
  static get properties() {
    return {};
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

  connectedCallback() {
    super.connectedCallback();
    globalData.subscribe("*", this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    globalData.unsubscribe("*", this);
  }

  _onEvent(event, detail) {
    this.dispatchEvent(new CustomEvent(event,{detail}));
  }

  set(path, value) {
    globalData.set(path, value);
  }

  get(path) {
    return globalData.get(path);
  }
}

customElements.define("global-data", GlobalData);
