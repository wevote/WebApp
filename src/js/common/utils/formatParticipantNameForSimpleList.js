const formatParticipantNameForSimpleList = (name) => {
  if (!name) {
    return '';
  }

  const [firstName, lastName] = name.split(' ');
  if (lastName) {
    return `${firstName} ${lastName.charAt(0)}.`;
  }
  return firstName;
};

export default formatParticipantNameForSimpleList;

