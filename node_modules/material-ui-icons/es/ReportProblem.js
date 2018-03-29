import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' });

let ReportProblem = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

ReportProblem = pure(ReportProblem);
ReportProblem.muiName = 'SvgIcon';

export default ReportProblem;