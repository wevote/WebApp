# How to test Wevote WebApp with BrowserStack

If you haven't updated your dependencies in a while, run `npm install` from your terminal to install Selenium Webdriver's Node binding.

Copy `WebApp/tests/browserstack/config-template.js` into `WebApp/tests/browserstack/config.js`:

    (WebAppEnv) $ cd WebApp
    (WebAppEnv) $ cp tests/browserstack/config-template.js tests/browserstack/config.js

You'll need to add your credentials to `config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press "show" next to where it says "Username and Access Keys" on the left panel. You should see your username and access key.

To run the tests, run

    (WebAppEnv) $ node tests/browserstack/index.js

When the test finishes, you should be able to see the video of your test on the BrowserStack Automate dashboard.