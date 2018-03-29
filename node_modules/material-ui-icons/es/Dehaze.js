import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M2 15.5v2h20v-2H2zm0-5v2h20v-2H2zm0-5v2h20v-2H2z' });

let Dehaze = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Dehaze = pure(Dehaze);
Dehaze.muiName = 'SvgIcon';

export default Dehaze;