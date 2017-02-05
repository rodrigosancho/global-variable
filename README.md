[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/trofrigo/global-variable)

# \<global-variable\> v0.1.3

[Polymer](https://www.polymer-project.org/1.0/) element that allows share data between non-relatives elements.

## Demo
<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.min.js"></script>
    <link rel="import" href="global-variable.html">
    <link rel="import" href="../paper-input/paper-input.html">
    <template is="dom-bind">
        <next-code-block></next-code-block>
    </template>
  </template>
</custom-element-demo>
```
-->
```html

  <global-data on-set="_onSet"
               on-subscribe="_onSubscribe"
               on-unsubscribe="_onUnsubscribe">
  </global-data>
              

  <global-variable key="input" 
                   value="{{ inputElement1 }}">
  </global-variable>
  <paper-input label="Element 1"
               value="{{ inputElement1 }}">
  </paper-input>
  <global-variable key="input" 
                   value="{{ inputElement2 }}">
  </global-variable>
  <paper-input label="Element 2"
               value="{{ inputElement2 }}">
  </paper-input>
  <global-variable key="input" 
                   value="{{ inputElement3 }}" 
                   readonly>
  </global-variable>
  <paper-input label="Element 3"
               value="{{ inputElement3 }}">
  </paper-input>
```

## Installation

To add this element to your project:

    bower i trofrigo/global-variable --save

## Usage

You can instance this element as many times as you desire. 
Every time that an instance's `value` is modified, it will be propagated to the rest of the 
instances of this element with the same `key`.
```html
  <global-variable key="input" 
                   value="{{ inputElement1 }}">
  </global-variable>
  <paper-input label="Element 1"
               value="{{ inputElement1 }}">
  </paper-input>

  <global-variable key="input" 
                   value="{{ inputElement2 }}">
  </global-variable>
  <paper-input label="Element 2"
               value="{{ inputElement2 }}">
  </paper-input>
```
Both input will show the same value.

In addition, you can use the `readonly` property. This property allows to receive any change in the path and prevents any value 
propagation form this instance to the others.
 
There is a second element, `<global-data></global-data>`,  that works as an API for the storage with two methods, 
`set(path, value)` and `get(path)`. This element will, as well, fire events every time that a path's value changes, 
an element subscribe to a path or an element unsubscribe from a path. 
```html    
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
    
 ```
 
##Changelog
###v0.1.3
* Fixed Issue #3. <global-variable> was not initializing the `value` in the `subscribe` method.
###v0.1.2
* Added a new element, <global-data>, that allows to access to the core's API, 
and fires events every time that an element subscribes or unsubscribes to a path 
or every time that path's value is modified.
* Encapsulating all the logic into a new core library.
###v0.1.1
* Fixed some errors in the README.md file
###v0.1.0
* First version of the element.
 
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Copyright (c) 2017 Rodrigo Sancho

Licensed under the [MIT license](https://github.com/trofrigo/global-variable/blob/master/LICENSE).
