import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '12', cy: '14', r: '3.2' });

var _ref2 = React.createElement('path', { d: 'M16 3.33c2.58 0 4.67 2.09 4.67 4.67H22c0-3.31-2.69-6-6-6v1.33M16 6c1.11 0 2 .89 2 2h1.33c0-1.84-1.49-3.33-3.33-3.33V6' });

var _ref3 = React.createElement('path', { d: 'M17 9c0-1.11-.89-2-2-2V4H9L7.17 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9h-5zm-5 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z' });

let LinkedCamera = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2,
  _ref3
);

LinkedCamera = pure(LinkedCamera);
LinkedCamera.muiName = 'SvgIcon';

export default LinkedCamera;