import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M7 14l5-5 5 5z' });

let ArrowDropUp = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ArrowDropUp = pure(ArrowDropUp);
ArrowDropUp.muiName = 'SvgIcon';

export default ArrowDropUp;