import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' });

let ExpandMore = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ExpandMore = pure(ExpandMore);
ExpandMore.muiName = 'SvgIcon';

export default ExpandMore;