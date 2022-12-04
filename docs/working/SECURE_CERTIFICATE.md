
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
- When all done with the [instructions in the article](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec), I copied the ```server.crt``` and ```server.key``` into these locations:

```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.crt /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```

```(WebAppEnv) $ cp /Users/<YOUR NAME HERE>/LocalSecureCertificates/server.key /Users/<YOUR NAME HERE>/MyProjects/WebApp/src/cert```

- Set "SECURE_CERTIFICATE_INSTALLED" to true in `WebApp/src/js/config.js` 
  ```
  // Note that we import these values where needed as 'webAppConfig'
  module.exports = {
    WE_VOTE_URL_PROTOCOL: "https://",   // "http://" for local dev or "https://" for live server
    WE_VOTE_HOSTNAME: "localhost:3000", // Don't add 'http...' here!  Live server: 'WeVote.US', Quality: 'quality.WeVote.US', developers: 'localhost:3000'
    SECURE_CERTIFICATE_INSTALLED: true,
  
    WE_VOTE_SERVER_ROOT_URL: "https://api.wevoteusa.org/",
    WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
    WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",
    WE_VOTE_SERVER_API_CDN_ROOT_URL: "https://cdn.wevoteusa.org/apis/v1/",
  ```

- Then run `npm start` again.

# Turn on https for WebApp
In WebApp/src/js/config.js, set SECURE_CERTIFICATE_INSTALLED to true, and then run `npm start-https`.

WebApp will startup at http://localhost.3000 

## Signing in with Facebook on your dev machine
### Make a small necessary change to your /etc/hosts

Facebook will no longer redirect to localhost, so make a second alias for 127.0.0.1 with this specific made up domain: `wevotedeveloper.com`

So we have to make a small change to /etc/hosts.  This is the before:
```
    (venv2) stevepodell@StevesM1Dec2021 WeVoteServer % cat /etc/hosts
    ##
    # Host Database
    #
    # localhost is used to configure the loopback interface
    # when the system is booting.  Do not change this entry.
    ##
    127.0.0.1       localhost
    255.255.255.255 broadcasthost
    ::1             localhost
    (venv2) stevepodell@StevesM1Dec2021 WeVoteServer % 
```
We have added a fake local domain `wevotedeveloper.com` for the [Facebook Valid OAuth Redirect URIs](https://developers.facebook.com/apps/1097389196952441/fb-login/settings/),
you need to add that domain to your 127.0.0.1 line in /etc/hosts.  After the change:
```
    (venv2) stevepodell@StevesM1Dec2021 WeVoteServer % cat /etc/hosts
    ##
    # Host Database
    #
    # localhost is used to configure the loopback interface
    # when the system is booting.  Do not change this entry.
    ##
    127.0.0.1       localhost wevotedeveloper.com
    255.255.255.255 broadcasthost
    ::1             localhost
    (venv2) stevepodell@StevesM1Dec2021 WeVoteServer % 
```

You will need to elevate your privileges with sudo to make this edit to this linux system file ... ` % sudo vi /etc/hosts` or with some other editor.

Start WebApp with the 'start-https' command, and open WebApp at https://wevotedeveloper.com:3000

Then Facebook signin should work on your dev machine

### Really Really Signing out of Facebook

Facebook takes many simultaneous approaches to prevent an end user from fully signing out of Facebook in a browser.

You will need to take the following steps to completely sign out, with no tendrils of Facebook's signin remaining, to prove that Facebook sign in from a brand new machine or browser will work.  
(In a Cordova simulator, simply go to Device/Erase All Content and Settings  -- and you will be fully signed out.)

1) Open Facebook in a tab
   1) Log out of facebook
   2) Using devtools/applications on that Facebook tab...
       1) turn off service workers
       2) clear "Local Storage"
       3) clear "Session Storage"
       4) clear Cookies
       5) remove anything in the URL bar except "https://www.facebook.com/"
2) In WebApp, sign out
   1) Using devtools/applications on the WebApp tab..
       1) clear "Local Storage"
       2) clear "Session Storage"
       3) clear Cookies
   2) Hard refresh WebApp Ctrl+Shift+R
   
Note: All the creative things that Facebook does to keep its hooks in your browser and to try to prevent you from fully logging out, may have left the tab with facebook in it messed-up -- you may need to close it and open another.




---

Next: [Contributing to the Project - Overview](../contributing/index.md)

[Go back to Readme Home](../../README.md)

