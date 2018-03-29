import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' });

let KeyboardArrowUp = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

KeyboardArrowUp = pure(KeyboardArrowUp);
KeyboardArrowUp.muiName = 'SvgIcon';

export default KeyboardArrowUp;