# How to run WebApp on a different port

In src/js/config.js, change WE_VOTE_HOSTNAME's port. For example,
```
module.exports = {
  WE_VOTE_URL_PROTOCOL: "http://",
  WE_VOTE_HOSTNAME: "localhost:8080", 
  SECURE_CERTIFICATE_INSTALLED: false,
```

