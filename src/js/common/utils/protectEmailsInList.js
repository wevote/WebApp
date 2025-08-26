
function obfuscateEmail (email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return email; // Return the original input if it's not a valid email
  }

  const [localPart, domain] = email.split('@');

  let obfuscatedLocalPart;
  if (localPart.length <= 3) {
    // For super short local parts, keep the first character and obfuscate the rest
    obfuscatedLocalPart = localPart[0] + '*'.repeat(localPart.length - 1);
  } else if (localPart.length <= 4) {
    // For short local parts, keep the first character and obfuscate the rest
    obfuscatedLocalPart = localPart[0] + localPart[1] + '*'.repeat(localPart.length - 2);
  } else {
    // For longer local parts, keep the first and last two characters
    const middleLength = localPart.length - 4;
    obfuscatedLocalPart = localPart.slice(0, 2) + '*'.repeat(middleLength) + localPart.slice(-2);
  }

  const [domainName, topLevelDomain] = domain.split('.');
  let obfuscatedDomainName;
  if (domainName.length <= 3) {
    // For short domain names, keep the first character and obfuscate the rest
    obfuscatedDomainName = domainName[0] + '*'.repeat(domainName.length - 1);
  } else {
    // For longer domain names, keep the first and last character
    obfuscatedDomainName = domainName[0] + '*'.repeat(domainName.length - 2) + domainName.slice(-1);
  }

  return `${obfuscatedLocalPart}@${obfuscatedDomainName}.${topLevelDomain}`;
}

export default function protectEmailsInList (incomingEmailList) {
  const protectedList = [];
  if (incomingEmailList) {
    incomingEmailList.forEach((unProtectedEmail) => {
      const protectedEmail = obfuscateEmail(unProtectedEmail);
      protectedList.push(protectedEmail);
    });
  }
  return protectedList;
}
