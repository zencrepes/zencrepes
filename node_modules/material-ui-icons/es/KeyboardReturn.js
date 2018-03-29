import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z' });

let KeyboardReturn = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

KeyboardReturn = pure(KeyboardReturn);
KeyboardReturn.muiName = 'SvgIcon';

export default KeyboardReturn;