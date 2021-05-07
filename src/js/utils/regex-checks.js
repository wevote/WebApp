// December 2018:  This is aan opensource file that we reuse, so no lint corrections are appropriate
/* eslint no-useless-escape: 0 */

export function validateEmail (email) {
  const trimmedEmail = email ? email.trim() : '';
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(trimmedEmail);
}

export function validatePhoneOrEmail (contactInfo) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
  const trimmedContactInfo = contactInfo ? contactInfo.trim() : '';
  if (emailRegex.test(trimmedContactInfo)) {
    return true;
  } else return phoneRegex.test(trimmedContactInfo);
}
