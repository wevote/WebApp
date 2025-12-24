import { normalizedHref } from '../../common/utils/hrefUtils';

// eslint-disable-next-line import/prefer-default-export
export function getKindOfShareFromURL () {
  const pathname = normalizedHref();

  const ballotShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ballot');
  const candidateShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/candidate');
  const measureShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/measure');
  const officeShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/office');
  const readyShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ready');
  const organizationShare = !ballotShare && !candidateShare && !measureShare && !officeShare && !readyShare;

  let kindOfShare;
  if (candidateShare) {
    kindOfShare = 'CANDIDATE';
  } else if (measureShare) {
    kindOfShare = 'MEASURE';
  } else if (officeShare) {
    kindOfShare = 'OFFICE';
  } else if (organizationShare) {
    kindOfShare = 'ORGANIZATION';
  } else if (readyShare) {
    kindOfShare = 'READY';
  } else {
    kindOfShare = 'BALLOT';
  }
  return kindOfShare;
}
