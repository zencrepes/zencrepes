import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M19 13H5v-2h14v2z' });

let Remove = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Remove = pure(Remove);
Remove.muiName = 'SvgIcon';

export default Remove;