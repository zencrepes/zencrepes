import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z' });

let ViewCarousel = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ViewCarousel = pure(ViewCarousel);
ViewCarousel.muiName = 'SvgIcon';

export default ViewCarousel;