import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '12', cy: '12', r: '10' });

let Brightness1 = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Brightness1 = pure(Brightness1);
Brightness1.muiName = 'SvgIcon';

export default Brightness1;