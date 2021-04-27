import React from 'react';

const displayFriendsTabs = React.lazy(() => import('./displayFriendsTabs'));
const { startsWith } = React.lazy(() => import('./textFormat'));

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
