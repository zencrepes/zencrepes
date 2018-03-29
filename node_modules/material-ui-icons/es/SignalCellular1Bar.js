import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { fillOpacity: '.3', d: 'M2 22h20V2z' });

var _ref2 = React.createElement('path', { d: 'M12 12L2 22h10z' });

let SignalCellular1Bar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

SignalCellular1Bar = pure(SignalCellular1Bar);
SignalCellular1Bar.muiName = 'SvgIcon';

export default SignalCellular1Bar;