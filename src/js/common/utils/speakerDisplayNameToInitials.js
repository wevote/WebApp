import speakerDisplayNameToAvatarColor from './speakerDisplayNameToAvatarColor';

function speakerDisplayNameToInitials (speakerDisplayName) {
  let initials;
  let speakerDisplayNameModified = speakerDisplayName;
  if (speakerDisplayName && speakerDisplayName.length > 0) {
    const nameParts = speakerDisplayName.split(' ');
    if (nameParts && nameParts.length > 0) {
      initials =
        nameParts.length > 1 ?
          `${nameParts[0][0]}${nameParts[1][0]}` :
          `${nameParts[0][0]}`;
    } else {
      // eslint-disable-next-line prefer-destructuring
      initials = Array.from(speakerDisplayName)[0];
      speakerDisplayNameModified = speakerDisplayName;
    }
  } else {
    initials = 'AB';
    speakerDisplayNameModified = 'AB';
  }
  return {
    sx: {
      bgcolor: speakerDisplayNameToAvatarColor(speakerDisplayNameModified),
    },
    children: initials,
  };
}
export default speakerDisplayNameToInitials;
