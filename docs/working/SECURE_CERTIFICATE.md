
# Installing Secure Certificate
In order to sign in with Facebook or Twitter within your localhost development environment, 
you must create and install a local secure certificate. We have configured Facebook (we are still working on
configuring Twitter) to support sign in from `https://localhost:3000/`

I used a FreeCodeCamp.org article 
[How to get HTTPS working on your local development environment in 5 minutes](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec) 
that describes how to install a locally signed secure certificate on the Mac (it actually took me about 20 minutes). Notes:

- I created a ```/Users/<YOUR NAME HERE>/LocalSecureCertificates``` folder, and ran the instructions in that folder.
- In "Step 2: Trust the root SSL certificate" of the article, when it says "Open Keychain Access on your Mac", you can find "Keychain Access" in your "Applications/Utilities" folder.
- In "Step 2: Domain SSL certificate" of the article, you will need to create two files in your "LocalSecureCertificates" folder, called `server.csr.cnf` (file 1) and `v3.ext` (file 2). Place the contents described in the article for each file, into each file.
- When all done with the [instructions in the article](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec), I copied the ```server.crt``` and server.key into these locations:

```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.crt /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```

```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.key /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```

- Set "SECURE_CERTIFICATE_INSTALLED" to true in `WebApp/src/js/config.js` 
  ```
  // Note that we import these values into "webAppConfig" (so we can search for it)
    module.exports = {
      WE_VOTE_URL_PROTOCOL: "https://", // "http://" for local dev or "https://" for live server
      WE_VOTE_HOSTNAME: "localhost:3000", // This should be without "http...". This is "WeVote.US" on live server.
      SECURE_CERTIFICATE_INSTALLED: true,
    
      WE_VOTE_SERVER_ROOT_URL: "https://api.wevoteusa.org/",
      WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
      WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",
      WE_VOTE_SERVER_API_CDN_ROOT_URL: "https://cdn.wevoteusa.org/apis/v1/",
  ```

- Then run `npm start` again.

# Turn on https for WebApp
In WebApp/src/js/config.js, set SECURE_CERTIFICATE_INSTALLED to true, and then run `npm start`.

---

Next: [Contributing to the Project - Overview](../contributing/index.md)

[Go back to Readme Home](../../README.md)

