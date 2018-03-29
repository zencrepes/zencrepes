import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M18 9v4H6V9H4v6h16V9z' });

let SpaceBar = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

SpaceBar = pure(SpaceBar);
SpaceBar.muiName = 'SvgIcon';

export default SpaceBar;