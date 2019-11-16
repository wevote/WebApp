// December 2018:  This is aan opensource file that we reuse, so no lint corrections are appropriate
/* eslint no-useless-escape: 0 */

export function validateEmail (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export function validatePhoneOrEmail (contactInfo) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;

  if (emailRegex.test(contactInfo)) {
    return true;
  } else if (phoneRegex.test(contactInfo)) {
    return true;
  } else {
    return false;
  }
};
