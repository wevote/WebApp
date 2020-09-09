import displayFriendsTabs from './displayFriendsTabs';

export default function shouldHeaderRetreat (pathname) {
  const shouldRetreat = (
    typeof pathname !== 'undefined' && pathname && (
      pathname.indexOf('/ballot') === 0 ||
      pathname.indexOf('/candidate') === 0 ||
      pathname.indexOf('/measure') === 0 ||
      displayFriendsTabs()
    )
  );
  return shouldRetreat;
}
