'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.motion = exports.Curve = exports.Stage = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _curve = require('./curve');

var _curve2 = _interopRequireDefault(_curve);

var _curvejs = require('curvejs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// rewrite Stage in curvejs
var Stage = function (_Cstage) {
    (0, _inherits3.default)(Stage, _Cstage);

    function Stage(width, height, renderTo) {
        (0, _classCallCheck3.default)(this, Stage);

        if (arguments.length === 1) {
            var _this = (0, _possibleConstructorReturn3.default)(this, (Stage.__proto__ || (0, _getPrototypeOf2.default)(Stage)).call(this, width.canvas));

            _this.layer = width;
        } else if (arguments.length === 3) {
            var _this = (0, _possibleConstructorReturn3.default)(this, (Stage.__proto__ || (0, _getPrototypeOf2.default)(Stage)).call(this, width, height, renderTo));

            throw new Error('sprite-extend-curvejs can and must have only one argument！');
        }
        return (0, _possibleConstructorReturn3.default)(_this);
    }

    (0, _createClass3.default)(Stage, [{
        key: 'update',
        value: function update(notClear) {
            var _this2 = this;

            this.children.forEach(function (child) {
                child.draw(_this2.layer);
            });
        }
    }, {
        key: 'add',
        value: function add(line) {
            line.renderer = this.layer;
            this.children.push(line);
        }
    }]);
    return Stage;
}(_curvejs.Stage);

// rewrite Curve in curvejs


var Curve = function (_Ccurve) {
    (0, _inherits3.default)(Curve, _Ccurve);

    function Curve(option) {
        (0, _classCallCheck3.default)(this, Curve);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (Curve.__proto__ || (0, _getPrototypeOf2.default)(Curve)).call(this, option));

        _this3.isGroupAddToLayer = false;
        return _this3;
    }

    (0, _createClass3.default)(Curve, [{
        key: '_initVision',
        value: function _initVision() {
            var visionCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 80;

            this.visionGroup = new _spriteCore.Group({
                virtual: true
            });

            for (var i = 0; i < visionCount; i++) {
                this.tick(true);
                var curve = new _curve2.default();
                curve.attr({
                    color: this.color
                });
                this.visionGroup.append(curve);
            }
        }
    }, {
        key: 'tick',
        value: function tick(tickSelf) {
            this._now = Date.now();

            if (this._now - this._preDate > this.visionInterval || tickSelf) {
                this.vision = this.vision.concat([].concat((0, _toConsumableArray3.default)(this.points), [this.color]));

                if (this.vision.length > this.visionMax) {
                    this.vision.splice(0, 9);
                };
                this._preDate = this._now;
            }

            if (!this.pauseMotion) {
                this.motion.call(this, this.points, this.data);
            }

            if (this._targetPoints) {
                this._pointsTo();
            }
        }
    }, {
        key: 'draw',
        value: function draw(layer) {
            var _this4 = this;

            if (!this.isGroupAddToLayer) {
                layer.append(this.visionGroup);
                this.isGroupAddToLayer = true;
            }
            this.tick();
            var va = this.vision;
            var lastIndex = this.visionGroup.length - 1;
            this.visionGroup.children.forEach(function (vision, index) {
                if (index === lastIndex) return;
                var path = va.slice(index * 9, index * 9 + 9);
                var opacity = index * 9 / _this4.visionMax * _this4.visionAlpha;
                vision.attr({
                    opacity: opacity,
                    d: path.slice(0, 8),
                    color: path[8]
                });
            });
        }
    }]);
    return Curve;
}(_curvejs.Curve);

exports.Stage = Stage;
exports.Curve = Curve;
exports.motion = _curvejs.motion;