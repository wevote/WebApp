
export function validateEmail (email) {
  //var regEmail = /^[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*(@|\sat\s)(?:[\w](?:[\w-]*[\w])?(\.;\sdot\s))+[\w](?:[\w-]*[\w])?; //regex expression is same as backend email validation

  //source: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
