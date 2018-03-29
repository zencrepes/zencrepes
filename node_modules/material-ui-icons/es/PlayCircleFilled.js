import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' });

let PlayCircleFilled = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

PlayCircleFilled = pure(PlayCircleFilled);
PlayCircleFilled.muiName = 'SvgIcon';

export default PlayCircleFilled;