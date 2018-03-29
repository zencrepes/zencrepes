import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M10 8H8v4H4v2h4v4h2v-4h4v-2h-4zm4.5-1.92V7.9l2.5-.5V18h2V5z' });

let PlusOne = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

PlusOne = pure(PlusOne);
PlusOne.muiName = 'SvgIcon';

export default PlusOne;