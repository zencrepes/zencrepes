import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M7 2v11h3v9l7-12h-4l4-8z' });

let FlashOn = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

FlashOn = pure(FlashOn);
FlashOn.muiName = 'SvgIcon';

export default FlashOn;