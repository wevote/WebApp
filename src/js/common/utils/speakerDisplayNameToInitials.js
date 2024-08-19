import speakerDisplayNameToAvatarColor from './speakerDisplayNameToAvatarColor';

function speakerDisplayNameToInitials (speakerDisplayName) {
  const nameParts = speakerDisplayName.split(' ');
  const initials =
    nameParts.length > 1 ?
      `${nameParts[0][0]}${nameParts[1][0]}` :
      `${nameParts[0][0]}`;
  return {
    sx: {
      bgcolor: speakerDisplayNameToAvatarColor(speakerDisplayName),
    },
    children: initials,
  };
}
export default speakerDisplayNameToInitials;
