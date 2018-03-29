import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '12', cy: '19', r: '2' });

var _ref2 = React.createElement('path', { d: 'M10 3h4v12h-4z' });

let PriorityHigh = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

PriorityHigh = pure(PriorityHigh);
PriorityHigh.muiName = 'SvgIcon';

export default PriorityHigh;