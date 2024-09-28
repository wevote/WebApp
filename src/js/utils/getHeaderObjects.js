export default function getHeaderObjects () {
  const { headerObjects: temp } = window;
  if (!temp) {
    window.headerObjects = {
      logo: null,
      ready: null,
      ballot: null,
      candidates: null,
      challenges: null,
      opinions: null,
      discuss: null,
      bell: null,
      photo: null,
    };
  }
  const { headerObjects } = window;
  return headerObjects;
}
