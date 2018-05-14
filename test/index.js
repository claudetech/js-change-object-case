'use strict';

var expect = require('chai').expect;

var changeCase = require('..');
var transformationNames = require('../transformations');

describe('changeObjectCase', function () {
  it('should export all the functions in changeCase', function () {
    var baseChangeCase = require('change-case');
    for (var i in baseChangeCase) {
      expect(baseChangeCase[i]).to.eq(changeCase[i]);
    }
  });

  it('should have key and array transformer for changeCase transformations', function () {
    for (var i = 0; i < transformationNames.length; i++) {
      expect(changeCase[transformationNames[i] + 'Keys']).to.be.a('function');
      expect(changeCase[transformationNames[i] + 'Array']).to.be.a('function');
      expect(changeCase['to' + changeCase.ucFirst(transformationNames[i])]).to.be.a('function');
    }
  });

  describe('camelKeys', function () {
    it('should transform keys to camelCase', function () {
      var result = changeCase.camelKeys({foo_bar: 1, bar_baz: 2});
      expect(result).to.deep.eq({fooBar: 1, barBaz: 2});
    });

    it('should not recurse by default', function () {
      var result = changeCase.camelKeys({foo_bar: 1, bar_baz: {baz_qux: 3}});
      expect(result).to.deep.eq({fooBar: 1, barBaz: {baz_qux: 3}});
    });

    it('should recurse when option passed', function () {
      var result = changeCase.camelKeys({foo_bar: 1, bar_baz: {baz_qux: 3}}, {recursive: true});
      expect(result).to.deep.eq({fooBar: 1, barBaz: {bazQux: 3}});
    });

    it('should not recurse on array by default', function () {
      var result = changeCase.camelKeys({foo_bar: [{bar_baz: 1}]});
      expect(result).to.deep.eq({fooBar: [{bar_baz: 1}]});
    });

    it('should recurse on array when option passed', function () {
      var result = changeCase.camelKeys({foo_bar: [{bar_baz: 1}]}, {arrayRecursive: true});
      expect(result).to.deep.eq({fooBar: [{barBaz: 1}]});
    });

    it('should keep last value throw when key collapse and no option passed', function () {
      var fn = function () { changeCase.camelKeys({foo_b1: 1, foo_b_1: 2}); };
      expect(fn).not.to.throw(Error);
    });

    it('should throw when key collapse and option passed', function () {
      var fn = function () { changeCase.camelKeys({foo_b1: 1, foo_b_1: 2}, {throwOnDuplicate: true}); };
      expect(fn).to.throw(Error);
    });

    it('should work with nested objects', function () {
      var input = {
        foo_bar: {
          bar_baz: [{baz_qux: 1}]
        }
      };
      expect(changeCase.camelKeys(input)).to.deep.eq({fooBar: {bar_baz: [{baz_qux: 1}]}});
      expect(changeCase.camelKeys(input, {recursive: true})).to.deep.eq({fooBar: {barBaz: [{baz_qux: 1}]}});

    });

    it('should work with deeply nested objects', function () {
      var input = {
        foo_bar: {
          bar_baz: [{
            a_b: [
              [{b_c: 1}, 8],
              {c_d: {d_e: 2}}
            ],
            c_d: null
          }]
        },
        bar_baz: 1
      };
      var expected = {
        fooBar: {
          barBaz: [{
            aB: [
              [{bC: 1}, 8],
              {cD: {dE: 2}}
            ],
            cD: null
          }]
        },
        barBaz: 1
      };
      expect(changeCase.camelKeys(input, {recursive: true, arrayRecursive: true})).to.deep.eq(expected);
    });
  });

  describe('snakeArray', function () {
    it('should transform array objects', function () {
      var result = changeCase.snakeArray([{fooBar: 1}, 2]);
      expect(result).to.deep.eq([{foo_bar: 1}, 2]);
    });

    it('should raise when non array passed', function () {
      expect(function () { changeCase.snakeArray(1); }).to.throw(Error);
    });
  });

  describe('defaultOptions', function () {
    before(function () {
      changeCase.options = {recursive: true};
    });
    it('should use default options when non provided', function () {
      expect(changeCase.camelKeys({a_b: {b_c: 1}})).to.deep.eq({aB: {bC: 1}});
    });
    it('should use provided options', function () {
      expect(changeCase.camelKeys({a_b: {b_c: 1}}, {recursive: false})).to.deep.eq({aB: {b_c: 1}});
    });
  });

  describe('toCamel', function () {
    it('should leave a string as it is', function () {
      var result = changeCase.toCamel('string');
      expect(result).to.eq('string');
    });

    it('should leave a number as it is', function () {
      var result = changeCase.toCamel(1.2);
      expect(result).to.eq(1.2);
    });

    it('should convert an array', function () {
      var result = changeCase.toCamel([{foo_bar: 1}, 2]);
      expect(result).to.deep.eq([{fooBar: 1}, 2]);
    });

    it('should convert a complex, deep, mixed data structure', function () {
      var input = [
        'string',
        1.2,
        {
          foo_bar: {
            bar_baz: [{
              a_b: [
                [{b_c: 1}, 8],
                {c_d: {d_e: 2}},
                'another_string',
                2
              ],
              c_d: null
            }]
          },
          bar_baz: 1
        }
      ];
      var expected = [
        'string',
        1.2,
        {
          fooBar: {
            barBaz: [{
              aB: [
                [{bC: 1}, 8],
                {cD: {dE: 2}},
                'another_string',
                2
              ],
              cD: null
            }]
          },
          barBaz: 1
        }
      ];
      var result = changeCase.toCamel(input, {recursive: true, arrayRecursive: true});
      expect(result).to.deep.eq(expected);
    });
  })
});
