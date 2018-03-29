import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z' });

let ExpandLess = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ExpandLess = pure(ExpandLess);
ExpandLess.muiName = 'SvgIcon';

export default ExpandLess;