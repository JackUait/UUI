import * as React from 'react';

export default 'SvgrURL';

const SvgrMock = React.forwardRef((props, ref) => React.createElement('span', { ...props, ref}));
export const ReactComponent = SvgrMock;