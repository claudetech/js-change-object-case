# change-object-case [![Build Status](https://travis-ci.org/claudetech/js-change-object-case.svg?branch=master)](https://travis-ci.org/claudetech/js-change-object-case) [![Coverage Status](https://coveralls.io/repos/claudetech/js-change-object-case/badge.svg?branch=master&service=github)](https://coveralls.io/github/claudetech/js-change-object-case?branch=master)

A library based on [change-case](https://github.com/blakeembrey/change-case) to change object keys case.

The library reexports all the methods of change-case so that it can be used
as a drop-in replacement.

Each function of change-case has an equivalent with the suffix `Keys`
for object keys and `Array` to map on each object in an array.
So for example, from the function `camel` will be created `camelKeys` and `camelArray`.

## Installation

You can get the package with npm

```
$ npm install --save change-object-case
```

or with bower

```
$ bower install --save change-object-case
```

## Usage

```javascript
var changeCase = require('change-object-case');
changeCase.camelKeys({foo_bar: {bar_baz: [{baz_qux: 1}]}});
// {fooBar: {bar_baz: [{baz_qux: 1}]}}
changeCase.camelKeys({foo_bar: {bar_baz: [{baz_qux: 1}]}}, {recursive: true});
// {fooBar: {barBaz: [{baz_qux: 1}]}}
changeCase.camelKeys({foo_bar: {bar_baz: [{baz_qux: 1}]}}, {recursive: true, arrayRecursive: true});
// {fooBar: {barBaz: [{bazQux: 1}]}}
changeCase.camelArray([{foo_bar: 1}, 2]);
// [{fooBar: 1}, 2]
```

By default, recursion is turned off, and you have to explictly pass `{recursive: true}` to get objects processed recursively and `{arrayRecursive: true}` to get arrays transformed.
You can set these values globally by changing `changeCase.options`:

```javascript
var changeCase = require('change-object-case');
changeCase.options = {recursive: true, arrayRecursive: true};
changeCase.camelKeys({foo_bar: {bar_baz: [{baz_qux: 1}]}});
// {fooBar: {barBaz: [{bazQux: 1}]}}
```

### Key collision

When converting case, some keys can possibliy collide.
By default, the key is overriden, but you can choose to raise an error
in such a case by passing: `{throwOnDuplicate: true}`.

```
changeCase.camelKeys({a_b1: 1, a_b_1: 2}, {throwOnDuplicate: true});
// Error: duplicated key aB1
```

### Available methods

See the [change-case](https://github.com/blakeembrey/change-case) documentation
for all the available methods, and suffix with `Keys` or `Array` where you need.

## License

MIT
