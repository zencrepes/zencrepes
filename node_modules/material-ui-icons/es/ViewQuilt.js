import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M10 18h5v-6h-5v6zm-6 0h5V5H4v13zm12 0h5v-6h-5v6zM10 5v6h11V5H10z' });

let ViewQuilt = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ViewQuilt = pure(ViewQuilt);
ViewQuilt.muiName = 'SvgIcon';

export default ViewQuilt;