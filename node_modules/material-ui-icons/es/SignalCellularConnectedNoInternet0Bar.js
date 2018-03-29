import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { fillOpacity: '.3', d: 'M22 8V2L2 22h16V8z' });

var _ref2 = React.createElement('path', { d: 'M20 22h2v-2h-2v2zm0-12v8h2v-8h-2z' });

let SignalCellularConnectedNoInternet0Bar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

SignalCellularConnectedNoInternet0Bar = pure(SignalCellularConnectedNoInternet0Bar);
SignalCellularConnectedNoInternet0Bar.muiName = 'SvgIcon';

export default SignalCellularConnectedNoInternet0Bar;