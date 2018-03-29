import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M2 22h20V2z' });

let SignalCellular4Bar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

SignalCellular4Bar = pure(SignalCellular4Bar);
SignalCellular4Bar.muiName = 'SvgIcon';

export default SignalCellular4Bar;