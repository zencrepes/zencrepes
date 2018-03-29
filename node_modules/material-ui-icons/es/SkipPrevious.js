import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M6 6h2v12H6zm3.5 6l8.5 6V6z' });

let SkipPrevious = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

SkipPrevious = pure(SkipPrevious);
SkipPrevious.muiName = 'SvgIcon';

export default SkipPrevious;