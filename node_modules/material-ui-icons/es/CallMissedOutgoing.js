import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M3 8.41l9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7 3 8.41z' });

let CallMissedOutgoing = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

CallMissedOutgoing = pure(CallMissedOutgoing);
CallMissedOutgoing.muiName = 'SvgIcon';

export default CallMissedOutgoing;