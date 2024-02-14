import React from 'react';
import { renderLog } from '../../common/utils/logging';


// React functional component example
export default function StorybookRedirect () {
  renderLog('StorybookRedirect functional component');

  return (
    <a href="/storybook?path=/docs/design-system--docs">Redirect to Html page</a>
  );
}
