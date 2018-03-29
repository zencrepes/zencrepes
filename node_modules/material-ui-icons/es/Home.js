import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' });

let Home = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

Home = pure(Home);
Home.muiName = 'SvgIcon';

export default Home;