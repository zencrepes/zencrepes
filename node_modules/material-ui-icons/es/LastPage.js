import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z' });

let LastPage = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

LastPage = pure(LastPage);
LastPage.muiName = 'SvgIcon';

export default LastPage;