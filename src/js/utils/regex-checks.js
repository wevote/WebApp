// December 2018:  This is an opensource file that we reuse, so no lint corrections are appropriate
/* eslint no-useless-escape: 0 */


const WSP = '[ \\t]';
const CRLF = '(?:\\r\\n)';
const NO_WS_CTL = '\\x01-\\x08\\x0b\\x0c\\x0f-\\x1f\\x7f';
const QUOTED_PAIR = '(?:\\\\.)';
const FWS = `(?:(?:${WSP}*${CRLF})?${WSP}+)`;
const CTEXT = `[${NO_WS_CTL}\\x21-\\x27\\x2a-\\x5b\\x5d-\\x7e]`;
const CCONTENT = `(?:${CTEXT}|${QUOTED_PAIR})`;
const COMMENT = `\\((?:${FWS}?${CCONTENT})*${FWS}?\\)`;
const CFWS = `(?:${FWS}?${COMMENT})*(?:${FWS}?${COMMENT}|${FWS})`;
const ATEXT = '[\\w!#$%&\'*+\\-/=\\?^`\\{\\|\\}~]';
// const ATOM = `${CFWS}?${ATEXT}+${CFWS}?`;
const DOT_ATOM_TEXT = `${ATEXT}+(?:\\.${ATEXT}+)*`;
const DOT_ATOM = `${CFWS}?${DOT_ATOM_TEXT}${CFWS}?`;
const QTEXT = `[${NO_WS_CTL}\\x21\\x23-\\x5b\\x5d-\\x7e]`;
const QCONTENT = `(?:${QTEXT}|${QUOTED_PAIR})`;
const QUOTED_STRING = `${CFWS}?"(?:${FWS}?${QCONTENT})*${FWS}?"${CFWS}?`;
const LOCAL_PART = `(?:${DOT_ATOM}|${QUOTED_STRING})`;
const DTEXT = `[${NO_WS_CTL}\\x21-\\x5a\\x5e-\\x7e]`;
const DCONTENT = `(?:${DTEXT}|${QUOTED_PAIR})`;
const DOMAIN_LITERAL = `${CFWS}?\\[(?:${FWS}?${DCONTENT})*${FWS}?\\]${CFWS}?`;
const DOMAIN = `(?:${DOT_ATOM}|${DOMAIN_LITERAL})`;
const ADDR_SPEC = `${LOCAL_PART}@${DOMAIN}`;
const VALID_ADDRESS_REGEXP = new RegExp(`^${ADDR_SPEC}$`);

export function validateEmail (email) {
  const trimmedEmail = email ? email.trim() : '';
  if (trimmedEmail.length < 6 || trimmedEmail.length > 254) {
    return false;
  } else {
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return VALID_ADDRESS_REGEXP.test(trimmedEmail);
  }
}

export function validatePhoneOrEmail (contactInfo) {
  // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
  const trimmedContactInfo = contactInfo ? contactInfo.trim() : '';
  if (VALID_ADDRESS_REGEXP.test(trimmedContactInfo)) {
    return true;
  } else return phoneRegex.test(trimmedContactInfo);
}
