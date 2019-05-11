# How to test Wevote WebApp with BrowserStack

If you haven't updated your dependencies in a while, run `npm install` from your terminal to install WebdriverIO (this is a framework that lets us test both the browser app and Cordova mobile apps with a single script). 

Copy `WebApp/tests/browserstack/browserstack.config-template.js` into `WebApp/tests/browserstack/browserstack.config.js`:

    (WebAppEnv) $ cd WebApp
    (WebAppEnv) $ cp tests/browserstack/browserstack.config-template.js tests/browserstack/browserstack.config.js

You'll need to add your credentials to `browserstack.config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press "show" next to where it says "Username and Access Keys" on the left panel. You should see your username and access key.

You will also need the URL for the android app .apk file. You can get this by asking someone else or by uploading the file with Browserstack's REST API as described [here](https://www.browserstack.com/app-automate/rest-api?framework=appium).

You may also wish to add a string for the build and name of your test (these are useful to help identify your tests on Browserstack's console)

To run the tests, run one or more of the following:

    (WebAppEnv) $ npm run ballotTest-Android
    (WebAppEnv) $ npm run ballotTest-Browser
    (WebAppEnv) $ npm run ballotTest-iOS
    (WebAppEnv) $ npm run marketingTest-Android
    (WebAppEnv) $ npm run marketingTest-Browser
    (WebAppEnv) $ npm run marketingTest-iOS

When the test finishes, you should be able to see the video of the browser test on the BrowserStack Automate dashboard and video of the mobile apps on BrowserStack App Automate.
