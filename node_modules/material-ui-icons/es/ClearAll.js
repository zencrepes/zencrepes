import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z' });

let ClearAll = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ClearAll = pure(ClearAll);
ClearAll.muiName = 'SvgIcon';

export default ClearAll;