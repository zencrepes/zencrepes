import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' });

let TurnedIn = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

TurnedIn = pure(TurnedIn);
TurnedIn.muiName = 'SvgIcon';

export default TurnedIn;