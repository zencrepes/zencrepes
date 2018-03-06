'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getClass;

var _flexboxgrid = require('flexboxgrid2/flexboxgrid2.css');

var _flexboxgrid2 = _interopRequireDefault(_flexboxgrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getClass(className) {
  return _flexboxgrid2.default && _flexboxgrid2.default[className] ? _flexboxgrid2.default[className] : className;
}