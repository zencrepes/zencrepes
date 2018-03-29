import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M8 5v14l11-7z' });

let PlayArrow = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

PlayArrow = pure(PlayArrow);
PlayArrow.muiName = 'SvgIcon';

export default PlayArrow;