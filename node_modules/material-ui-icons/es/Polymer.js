import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z' });

let Polymer = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Polymer = pure(Polymer);
Polymer.muiName = 'SvgIcon';

export default Polymer;