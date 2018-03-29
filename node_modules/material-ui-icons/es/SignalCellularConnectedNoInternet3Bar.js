import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { fillOpacity: '.3', d: 'M22 8V2L2 22h16V8z' });

var _ref2 = React.createElement('path', { d: 'M17 22V7L2 22h15zm3-12v8h2v-8h-2zm0 12h2v-2h-2v2z' });

let SignalCellularConnectedNoInternet3Bar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

SignalCellularConnectedNoInternet3Bar = pure(SignalCellularConnectedNoInternet3Bar);
SignalCellularConnectedNoInternet3Bar.muiName = 'SvgIcon';

export default SignalCellularConnectedNoInternet3Bar;