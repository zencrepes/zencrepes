import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M6 6h12v12H6z' });

let Stop = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Stop = pure(Stop);
Stop.muiName = 'SvgIcon';

export default Stop;