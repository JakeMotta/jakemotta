<reference types="@welldone-software/why-did-you-render" />;

import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  // eslint-disable-next-line
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    notifier: (options) => {
      // eslint-disable-next-line
      const { componentDisplayName, componentName, prevProps, nextProps, reason } = options;
      console.groupCollapsed(`whyDidYouRender: ${componentDisplayName || componentName}`);
      console.log('reason:', reason);
      // eslint-disable-next-line
      console.log('props:', { prevProps, nextProps });
      console.groupEnd();
    },
  });
}
