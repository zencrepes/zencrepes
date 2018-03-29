import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { fillOpacity: '.3', d: 'M22 8V2L2 22h16V8z' });

var _ref2 = React.createElement('path', { d: 'M14 22V10L2 22h12zm6-12v8h2v-8h-2zm0 12h2v-2h-2v2z' });

let SignalCellularConnectedNoInternet2Bar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

SignalCellularConnectedNoInternet2Bar = pure(SignalCellularConnectedNoInternet2Bar);
SignalCellularConnectedNoInternet2Bar.muiName = 'SvgIcon';

export default SignalCellularConnectedNoInternet2Bar;