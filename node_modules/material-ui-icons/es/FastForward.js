import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z' });

let FastForward = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

FastForward = pure(FastForward);
FastForward.muiName = 'SvgIcon';

export default FastForward;