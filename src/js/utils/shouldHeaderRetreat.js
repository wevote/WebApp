export default function shouldHeaderRetreat (pathname) {
  const shouldRetreat = (pathname &&
    (pathname.startsWith('/ballot') ||
    pathname.startsWith('/candidate') ||
    pathname.startsWith('/measure')
    ));
  return shouldRetreat;
}
