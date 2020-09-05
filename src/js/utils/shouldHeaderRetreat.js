import displayFriendsTabs from './displayFriendsTabs';

export default function shouldHeaderRetreat (pathname) {
  const shouldRetreat = (
    typeof pathname !== 'undefined' && pathname && (
      pathname.startsWith('/ballot') ||
      pathname.startsWith('/candidate') ||
      pathname.startsWith('/measure') ||
      displayFriendsTabs()
    )
  );
  return shouldRetreat;
}
