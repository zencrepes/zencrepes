import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M5 17h14v2H5zm7-12L5.33 15h13.34z' });

let Eject = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Eject = pure(Eject);
Eject.muiName = 'SvgIcon';

export default Eject;