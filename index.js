'use strict';

var changeCase = require('change-case');

var transformationNames = require('./transformations');

module.exports.options = {
  recursive: false,
  arrayRecursive: false,
  throwOnDuplicate: false,
  locale: null
};

function setDefaults(object, defaults) {
  object = object || {};
  for (var i in defaults) {
    if (defaults.hasOwnProperty(i) && typeof object[i] === 'undefined') {
      object[i] = defaults[i];
    }
  }
  return object;
}

function isObject(value) {
  if (!value) {
    return false;
  }
  return typeof value === 'object' || typeof value === 'function';
}

function isArray(value) {
  return (Array.isArray && Array.isArray(value)) ||
    Object.prototype.toString.call(value) === '[object Array]';
}

function computeNewValue(value, f, options, forceRecurse) {
  var valueIsArray = isArray(value);
  if (valueIsArray && options.arrayRecursive) {
    return transformArray(value, f, options);
  } else if (isObject(value) && !valueIsArray && (options.recursive || forceRecurse)) {
    return transformObjectKeys(value, f, options);
  } else {
    return value;
  }
}

function transformArray(array, f, options) {
  options = setDefaults(options, module.exports.options);
  if (!isArray(array)) {
    throw new Error('transformArray expects an array');
  }
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    var newValue = computeNewValue(value, f, options, true);
    result.push(newValue);
  }
  return result;
}

function transformObjectKeys(object, f, options) {
  options = setDefaults(options, module.exports.options);
  var result = {};
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var value = object[key];
      var newKey = f(key, options.locale);
      if (result.hasOwnProperty(newKey) && options.throwOnDuplicate) {
        throw new Error('duplicated key ' + newKey);
      }
      result[newKey] = computeNewValue(value, f, options, false);
    }
  }
  return result;
}

function makeObjectTransformation(f) {
  return function (object, options) {
    return transformObjectKeys(object, f, options);
  };
}

function makeArrayTransformation(f) {
  return function (array, options) {
    return transformArray(array, f, options);
  };
}

function exportTransformation(name) {
  var f = changeCase[name];
  module.exports[name + 'Keys'] = makeObjectTransformation(f);
  module.exports[name + 'Array'] = makeArrayTransformation(f);
}

for (var i in changeCase) {
  if (changeCase.hasOwnProperty(i)) {
    module.exports[i] = changeCase[i];
  }
}

for (var i = 0; i < transformationNames.length; i++) {
  exportTransformation(transformationNames[i]);
}
