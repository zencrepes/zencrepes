import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' });

let FilterList = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

FilterList = pure(FilterList);
FilterList.muiName = 'SvgIcon';

export default FilterList;