import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' });

let Menu = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Menu = pure(Menu);
Menu.muiName = 'SvgIcon';

export default Menu;