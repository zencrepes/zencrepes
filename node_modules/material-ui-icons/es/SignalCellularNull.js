import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M20 6.83V20H6.83L20 6.83M22 2L2 22h20V2z' });

let SignalCellularNull = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

SignalCellularNull = pure(SignalCellularNull);
SignalCellularNull.muiName = 'SvgIcon';

export default SignalCellularNull;