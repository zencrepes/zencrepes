import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z' });

let CallReceived = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

CallReceived = pure(CallReceived);
CallReceived.muiName = 'SvgIcon';

export default CallReceived;