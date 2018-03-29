import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '7.2', cy: '14.4', r: '3.2' });

var _ref2 = React.createElement('circle', { cx: '14.8', cy: '18', r: '2' });

var _ref3 = React.createElement('circle', { cx: '15.2', cy: '8.8', r: '4.8' });

let BubbleChart = props => React.createElement(
  SvgIconCustom,
  props,
  _ref,
  _ref2,
  _ref3
);

BubbleChart = pure(BubbleChart);
BubbleChart.muiName = 'SvgIcon';

export default BubbleChart;