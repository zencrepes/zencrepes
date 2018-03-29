import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M11 9l1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6 6-6z' });

let SubdirectoryArrowLeft = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

SubdirectoryArrowLeft = pure(SubdirectoryArrowLeft);
SubdirectoryArrowLeft.muiName = 'SvgIcon';

export default SubdirectoryArrowLeft;