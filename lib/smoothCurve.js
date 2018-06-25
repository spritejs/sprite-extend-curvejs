'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _curve = require('./curve');

var _curve2 = _interopRequireDefault(_curve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SmoothCurve = function (_Curve) {
  (0, _inherits3.default)(SmoothCurve, _Curve);

  function SmoothCurve() {
    (0, _classCallCheck3.default)(this, SmoothCurve);
    return (0, _possibleConstructorReturn3.default)(this, (SmoothCurve.__proto__ || (0, _getPrototypeOf2.default)(SmoothCurve)).apply(this, arguments));
  }

  (0, _createClass3.default)(SmoothCurve, [{
    key: 'render',
    value: function render(t, ctx) {
      ctx.save();
      ctx.lineWidth = this.attr('lineWidth');
      var points = this.attr('d');
      var color = this.attr('color');
      var isStripe = Array.isArray(color);
      if (!isStripe) {
        ctx.strokeStyle = color;
      }

      ctx.beginPath();
      ctx.moveTo(points[0], points[1]);
      ctx.globalAlpha = this.attr('opacity');

      for (var i = 2, len = points.length; i < len; i += 2) {

        if (isStripe) {
          ctx.strokeStyle = color[i / 2 % 2];
          if (i !== 2) {
            ctx.beginPath();
            ctx.moveTo((points[i - 2] + points[i]) / 2, (points[i - 1] + points[i + 1]) / 2);
          }
        }
        if (i === points.length - 4) {
          ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]);
        } else {
          ctx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) / 2, (points[i + 1] + points[i + 3]) / 2);
        }
        ctx.stroke();
      }
      ctx.restore();
      return ctx;
    }
  }]);
  return SmoothCurve;
}(_curve2.default);

_curve2.default.defineAttributes({
  lineWidth: function lineWidth(attr, val) {
    attr.clearCache();
    attr.set('lineWidth', val);
  },
  color: function color(attr, val) {
    attr.clearCache();
    if (Array.isArray(val)) {
      attr.set('color', val.map(function (one) {
        return (0, _spriteUtils.parseColorString)(val);
      }));
    } else {
      attr.set('color', (0, _spriteUtils.parseColorString)(val));
    }
  }
});

(0, _spriteCore.registerNodeType)('smoothCurve', SmoothCurve);

exports.default = SmoothCurve;