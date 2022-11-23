import { normalizedHref, normalizedHrefPage } from '../common/utils/hrefUtils';

// eslint-disable-next-line import/prefer-default-export
export function getPageKey () {
  const useLongerPath = ['settings', 'more'];
  let page = normalizedHrefPage() || 'ready';
  if (useLongerPath.includes(page)) {
    page = normalizedHref();
  }
  // console.log(`getPageKey page: ${page}`);
  return page;
}
