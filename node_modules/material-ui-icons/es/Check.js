import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' });

let Check = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Check = pure(Check);
Check.muiName = 'SvgIcon';

export default Check;