'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _spriteCore = require('sprite-core');

var _spriteUtils = require('sprite-utils');

var _render = require('sprite-core/lib/helpers/render');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create a new kind of sprite
var Curve = function (_BaseSprite) {
  (0, _inherits3.default)(Curve, _BaseSprite);

  function Curve() {
    (0, _classCallCheck3.default)(this, Curve);
    return (0, _possibleConstructorReturn3.default)(this, (Curve.__proto__ || (0, _getPrototypeOf2.default)(Curve)).apply(this, arguments));
  }

  (0, _createClass3.default)(Curve, [{
    key: 'render',
    value: function render(t, drawingContext) {
      drawingContext.save();
      drawingContext.strokeStyle = (0, _render.findColor)(drawingContext, this, 'color');
      var points = this.attr('d');
      drawingContext.beginPath();
      drawingContext.moveTo.call(drawingContext, points[0], points[1]);
      drawingContext.bezierCurveTo.call(drawingContext, points[2], points[3], points[4], points[5], points[6], points[7]);
      drawingContext.stroke();
      drawingContext.restore();
      return drawingContext;
    }
  }, {
    key: 'contentSize',
    get: function get() {
      var _attr = this.attr('size'),
          _attr2 = (0, _slicedToArray3.default)(_attr, 2),
          width = _attr2[0],
          height = _attr2[1];

      if (width === '' && this.layer) {
        width = this.layer.canvas.clientWidth;
      }
      if (height === '' && this.layer) {
        height = this.layer.canvas.clientHeight;
      }
      return [width, height];
    }
  }]);
  return Curve;
}(_spriteCore.BaseSprite);

Curve.defineAttributes({
  init: function init(attr) {
    attr.setDefault({
      color: (0, _spriteUtils.parseColorString)('white')
    });
  },
  color: function color(attr, val) {
    attr.clearCache();
    attr.set('color', (0, _spriteUtils.parseColorString)(val));
  },
  d: function d(attr, val) {
    attr.clearCache();
    attr.set('d', val);
  }
});

Curve.setAttributeEffects({
  d: _spriteCore.Effects.arrayEffect,
  color: _spriteCore.Effects.colorEffect
});

(0, _spriteCore.registerNodeType)('curve', Curve);

exports.default = Curve;