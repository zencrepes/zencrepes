import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z' });

let ExposureNeg1 = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ExposureNeg1 = pure(ExposureNeg1);
ExposureNeg1.muiName = 'SvgIcon';

export default ExposureNeg1;