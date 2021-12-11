// eslint-disable-next-line import/prefer-default-export
export function getHeaderObjects () {
  const { headerObjects: temp } = window;
  if (!temp) {
    window.headerObjects = {
      logo: null,
      ready: null,
      ballot: null,
      opinions: null,
      discuss: null,
      bell: null,
      photo: null,
    };
  }
  return window.headerObjects;
}
