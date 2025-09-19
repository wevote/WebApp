import DesignTokenColors from '../components/Style/DesignTokenColors';

function speakerDisplayNameToAvatarColor (speakerDisplayName) {
  let hashForRandomIndexValue = 0;
  const speakerDisplayNameSafe =  speakerDisplayName || 'speakerDisplayName was undefined';

  /* eslint-disable no-bitwise */
  for (let i = 0; i < speakerDisplayNameSafe.length; i += 1) {
    hashForRandomIndexValue =
      speakerDisplayNameSafe.charCodeAt(i) +
      ((hashForRandomIndexValue << 5) - hashForRandomIndexValue);
  }
  const avatarColorKeys = Object.keys(DesignTokenColors).filter((key) => key.startsWith('avatar'));
  /* eslint-enable no-bitwise */
  if (avatarColorKeys.length === 0) {
    console.error('No avatar colors found in DesignTokenColors.');
    return DesignTokenColors.avatarBlue900;
  }
  const colorIndex = Math.abs(hashForRandomIndexValue) % avatarColorKeys.length;
  const colorKey = avatarColorKeys[colorIndex];
  return DesignTokenColors[colorKey];
}

export default speakerDisplayNameToAvatarColor;
