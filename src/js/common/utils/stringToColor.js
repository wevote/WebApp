import DesignTokenColors from '../components/Style/DesignTokenColors';


function stringToColor (string) {
  let hash = 0;
  /* eslint-disable no-bitwise */
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const avatarColorKeys = Object.keys(DesignTokenColors).filter((key) => key.startsWith('avatar'));
  /* eslint-enable no-bitwise */
  if (avatarColorKeys.length === 0) {
    console.error('No avatar colors found in DesignTokenColors.');
    return DesignTokenColors.avatarBlue700; // Default to a specific color if none are found
  }
  const colorIndex = Math.abs(hash) % avatarColorKeys.length;
  const colorKey = avatarColorKeys[colorIndex];
  return DesignTokenColors[colorKey];
}

export default stringToColor;
