import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z' });

let VerticalAlignTop = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

VerticalAlignTop = pure(VerticalAlignTop);
VerticalAlignTop.muiName = 'SvgIcon';

export default VerticalAlignTop;