import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '12', cy: '12', r: '3.2' });

var _ref2 = React.createElement('path', { d: 'M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z' });

let LocalSee = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

LocalSee = pure(LocalSee);
LocalSee.muiName = 'SvgIcon';

export default LocalSee;