import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z' });

let ChangeHistory = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ChangeHistory = pure(ChangeHistory);
ChangeHistory.muiName = 'SvgIcon';

export default ChangeHistory;