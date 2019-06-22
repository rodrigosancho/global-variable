import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import globalData from "./core/global-data";

/**
 * `global-variable` Allows share data between non-related elementsç`<global-variable>`
 *
 * [Polymer element](https://www.polymer-project.org/3.0/) that allows share data between non-relatives elements.
 *
 * You can instance this element as many times as you desire.
 * Every time that an instance's `value` is modified, it will be propagated to the rest of the
 * instances of this element with the same `key`.
 * ```html
 * <global-variable key="input"
 *                  value="{{ inputElement1 }}"></global-variable>
 * <paper-input label="Element 1"
 *             value="{{ inputElement1 }}"></paper-input>
 *
 * <global-variable key="input"
 *                 value="{{ inputElement2 }}"></global-variable>
 * <paper-input label="Element 2"
 *              value="{{ inputElement2 }}"></paper-input>
 * ```
 * Both input will show the same value
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 *
 */
class GlobalVariable extends PolymerElement {
  static get properties() {
    return {
      _notify: {
        type: Function,
        computed: "_notifyOrigin(key, readonly)"
      },

      /** Key to subscribe */
      key: {
        type: String,
        reflectToAttribute: true,
        observer: "_subscribe"
      },

      /** Current value of the element. If the element is subscribed to a key, this param is as well,
       * the current value for the key */
      value: {
        notify: true,
        observer: "_notify"
      },

      /** Readonly elements, will not propagate any possible value change to the rest of the subscribers */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
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

  disconnectedCallback() {
    super.disconnectedCallback();
    globalData.unsubscribe(this.key, this);
  }

  _notifyOrigin(key, readonly) {
    return newValue  => {
      if (!readonly) {
        globalData.set(key, newValue);
      }
    };
  }

  _subscribe(newKey, oldKey) {
    if (newKey != oldKey && oldKey) {
      globalData.unsubscribe(oldKey, this);
    }

    globalData.subscribe(newKey, this);
    this.set("value", globalData.get(newKey));
  }

  _onEvent(event, detail) {
    const { SET } = globalData.EVENTS;
    if (event === SET) {
      this._set(detail);
    }
  }

  _set(value) {
    this.set("value", value.value);
  }
}

customElements.define("global-variable", GlobalVariable);
