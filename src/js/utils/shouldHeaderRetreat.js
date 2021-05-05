import React from 'react';
import { startsWith } from './textFormat';

const displayFriendsTabs = React.lazy(() => import('./displayFriendsTabs'));


export default function shouldHeaderRetreat (pathname) {
  const shouldRetreat = (
    typeof pathname !== 'undefined' && pathname && (
      startsWith('/ballot', pathname) ||
      startsWith('/candidate', pathname) ||
      startsWith('/measure', pathname) ||
      displayFriendsTabs()
    )
  );
  return shouldRetreat;
}
