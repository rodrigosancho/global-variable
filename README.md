[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/trofrigo/global-variable)

# \<global-variable\>

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
  <global-variable key="input" 
                   value="{{ inputElement1 }}"></global-variable>
  <paper-input label="Element 1"
               value="{{ inputElement1 }}"></paper-input>

  <global-variable key="input" 
                   value="{{ inputElement2 }}"></global-variable>
  <paper-input label="Element 2"
               value="{{ inputElement2 }}"></paper-input>
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
                   value="{{ inputElement1 }}"></global-variable>
  <paper-input label="Element 1"
               value="{{ inputElement1 }}"></paper-input>

  <global-variable key="input" 
                   value="{{ inputElement2 }}"></global-variable>
  <paper-input label="Element 2"
               value="{{ inputElement2 }}"></paper-input>
```
Both input will show the same value

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Copyright (c) 2017 Rodrigo Sancho

Licensed under the [MIT license](https://github.com/trofrigo/global-variable/blob/master/LICENSE).
