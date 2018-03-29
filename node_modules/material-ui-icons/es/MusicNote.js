import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

const SvgIconCustom = global.__MUI_SvgIcon__ || SvgIcon;

var _ref = React.createElement('path', { d: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' });

let MusicNote = props => React.createElement(
  SvgIconCustom,
  props,
  _ref
);

MusicNote = pure(MusicNote);
MusicNote.muiName = 'SvgIcon';

export default MusicNote;