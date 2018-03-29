import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z' });

let VolumeDown = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

VolumeDown = pure(VolumeDown);
VolumeDown.muiName = 'SvgIcon';

export default VolumeDown;