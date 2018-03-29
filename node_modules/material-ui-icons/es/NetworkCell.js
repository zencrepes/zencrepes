import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { fillOpacity: '.3', d: 'M2 22h20V2z' });

var _ref2 = React.createElement('path', { d: 'M17 7L2 22h15z' });

let NetworkCell = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2
);

NetworkCell = pure(NetworkCell);
NetworkCell.muiName = 'SvgIcon';

export default NetworkCell;