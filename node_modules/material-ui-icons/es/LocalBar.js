import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z' });

let LocalBar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

LocalBar = pure(LocalBar);
LocalBar.muiName = 'SvgIcon';

export default LocalBar;