import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' });

let Done = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Done = pure(Done);
Done.muiName = 'SvgIcon';

export default Done;