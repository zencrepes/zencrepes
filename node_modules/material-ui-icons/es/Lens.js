import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' });

let Lens = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Lens = pure(Lens);
Lens.muiName = 'SvgIcon';

export default Lens;