import DesignTokenColors from '../components/Style/DesignTokenColors';

function speakerDisplayNameToAvatarColor (speakerDisplayName) {
  if (speakerDisplayName && speakerDisplayName.length > 0) {
    let hashForRandomIndexValue = 0;
    /* eslint-disable no-bitwise */
    for (let i = 0; i < speakerDisplayName.length; i += 1) {
      hashForRandomIndexValue =
        speakerDisplayName.charCodeAt(i) +
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
  } else {
    return DesignTokenColors.avatarBlue900;
  }
}

export default speakerDisplayNameToAvatarColor;
