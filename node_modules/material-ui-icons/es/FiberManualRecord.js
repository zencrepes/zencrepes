import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('circle', { cx: '12', cy: '12', r: '8' });

let FiberManualRecord = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

FiberManualRecord = pure(FiberManualRecord);
FiberManualRecord.muiName = 'SvgIcon';

export default FiberManualRecord;