
# Installing Secure Certificate
In order to sign in with Facebook or Twitter within your localhost development environment, 
you must create and install a local secure certificate. We have configured Facebook (we are still working on
configuring Twitter) to support sign in from `https://localhost:3000/`

I used a FreeCodeCamp.org article (link below) that describes how to install a locally signed secure 
certificate on your my Mac (it actually took me about 20 minutes). Notes:

- I created a "LocalSecureCertificates" folder, and ran the instructions in that folder.
- When all done, I copied these two files into these locations:

```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.crt /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```
```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.key /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```

- Set "SECURE_CERTIFICATE_INSTALLED" to true in `WebApp/src/js/config.js` and run `npm start` again.

[Here is the Free Code Camp article.](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)


---

Next: [Contributing to the Project - Overview](../contributing/index.md)

[Go back to Readme Home](../../README.md)

