# How to run WebApp on a different port

In src/js/config.js, change ```WE_VOTE_HOSTNAME```'s port:

```
module.exports = {
  WE_VOTE_URL_PROTOCOL: "http://",
  WE_VOTE_HOSTNAME: "localhost:8080", 
  SECURE_CERTIFICATE_INSTALLED: false,
```

In server.js, change ```port```:

```
module.exports = function (PROD) {
  const port = 8080;
  const opts = { redirect: true };
```

In Gulpfile.js, add the ```port``` option to the initialization parameters for browserSync:

```
browserSync.init({
    proxy: "localhost:3003",
    open: false,
    port: 8080,
    ...
```