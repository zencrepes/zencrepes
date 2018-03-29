import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M7 9v6h4l5 5V4l-5 5H7z' });

let VolumeMute = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

VolumeMute = pure(VolumeMute);
VolumeMute.muiName = 'SvgIcon';

export default VolumeMute;