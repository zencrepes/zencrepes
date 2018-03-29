import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z' });

let Sort = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Sort = pure(Sort);
Sort.muiName = 'SvgIcon';

export default Sort;