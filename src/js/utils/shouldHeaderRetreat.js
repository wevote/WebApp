import displayFriendsTabs from './displayFriendsTabs';
import { startsWith } from './textFormat';


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
