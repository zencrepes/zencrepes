import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' });

let NavigateBefore = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

NavigateBefore = pure(NavigateBefore);
NavigateBefore.muiName = 'SvgIcon';

export default NavigateBefore;