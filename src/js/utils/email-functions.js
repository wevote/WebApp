
export function validateEmail (email) {

  if (arguments.length === 1) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } else {
    let onePass = false;
    Object.values(arguments).forEach(argument => {
      if (validateEmail(argument)) {
        onePass = true;
      }
    });
    return onePass;
  }
}
