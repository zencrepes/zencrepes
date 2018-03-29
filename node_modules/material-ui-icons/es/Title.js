import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M5 4v3h5.5v12h3V7H19V4z' });

let Title = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Title = pure(Title);
Title.muiName = 'SvgIcon';

export default Title;