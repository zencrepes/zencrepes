import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z' });

let ArrowDownward = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ArrowDownward = pure(ArrowDownward);
ArrowDownward.muiName = 'SvgIcon';

export default ArrowDownward;