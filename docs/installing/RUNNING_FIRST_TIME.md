# Running WebApp for the First Time
[Go back to Readme Home](../../README.md)

Please make sure you have read:

* [Preparing the Environment on Your Machine](ENVIRONMENT.md)

* [Bringing Code to Your Machine](CLONING_CODE.md)

Note that for the following steps, you must have activated the `WebAppEnv` Node virtual environment that you set up when preparing your environment. As a reminder, to activate the environment, you can run:

    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/WebAppEnv/
    $ . bin/activate

## Local config.js file

Every developer needs to maintain their own `WebApp/src/js/config.js` file, which can be copied from `WebApp/src/js/config-template.js`. The default configuration, copied from `config-template.js`, should work as-is for new developers.

Copy `WebApp/src/js/config-template.js` into `WebApp/src/js/config.js`:

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ cp src/js/config-template.js src/js/config.js
    (WebAppEnv) $ cp tests/browserstack/browserstack.config-template.js tests/browserstack/browserstack.config.js

## Mac users will need to install fsevents ("Native access to OS X FSEvents in Node.js"): 

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm install fsevents

## Install and start web application

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm install      // try sudo if it does not work
    (WebAppEnv) $ npm start

You should be able to visit WebApp here:

    http://localhost:3000

(If you would like to run the WebApp on a different port follow [these instructions](CHANGE_PORT.md))

## Start the WebApp in HTTPS

You will need to install [OpenSSL](https://www.openssl.org/) in order to make an ssl (https) connection to the WebApp on
your local PC/Mac.  An https connection will be required for oauth logins
via Twitter, Facebook, or Apple connect.  It is also required for donation with Stripe.

To install OpenSSL for Mac OS X, type in your terminal:  

1)  `brew install openssl`

1)  After installation, check the version: `openssl version`
    
1)  If it's not showing 1.0.2 as the most recent version, then you need to symlink to the updated openssl version like so:
    
    `ln -s /usr/local/Cellar/openssl/1.0.2h_1/bin/openssl /usr/local/bin/openssl `

Then you should be able to start the WebApp using SSL 

    (WebAppEnv) $ npm run start-https

You should be able to visit WebApp via HTTPS here:

    https://localhost:3000


## Using We Vote API server Locally: OPTIONAL

The default configuration connections to our live API server at: https://api.wevoteusa.org, so this step is optional.

If you would like to install the We Vote API server locally, start by reading the instructions to 
[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md).


---

Next: [Working with WebApp Day-to-Day](../working/README_WORKING_WITH_WEB_APP.md)

[Go back to Readme Home](../../README.md)
