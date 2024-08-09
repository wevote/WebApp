
# Testing WebApp - Overview of Process

  

## How to test Wevote WebApp with BrowserStack

  

If you haven't updated your dependencies in a while, run `npm install` to install or update [WebdriverIO](https://webdriver.io/), a framework that lets us test the browser app and Cordova mobile apps with a single script.

  

### Manual installation only

  

Copy `WebApp/tests/browserstack_automation/config/browserstack.config.template.js` into `WebApp/tests/browserstack_automation/config/browserstack.config.js`:

  

(WebAppEnv) $ cd WebApp

(WebAppEnv) $ cp tests/browserstack_automation/config/browserstack.config.template.js tests/browserstack_automation/config/browserstack.config.js

  

### Automated installation start here

  

You'll need to add your credentials to `browserstack.config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press the down arrow next to where it says "Access Key" in the header. You should see your username ("YOUR-USERNAME" below) and access key ("ACCESS-KEY-HERE" below). You will need both of these values to upload the compiled App.

  

You will also need the URL for the android app .apk file. You can get this by asking someone else or by uploading the file with Browserstack's REST API as described [here](https://www.browserstack.com/app-automate/rest-api?framework=appium).

Visit this page when you are signed into Browserstack, and they will customize the command that you need to run from your terminal window:

  

curl -u "YOUR-USERNAME:ACCESS-KEY-HERE" -X POST https://api-cloud.browserstack.com/app-automate/upload -F "file=@/path/to/app/file/Application-debug.apk" -F 'data={"custom_id": "MyApp"}'

  

You can find the latest WeVote APK (for Android) and IPA (for iOS) in [this Google Drive folder](https://drive.google.com/drive/u/0/folders/10tK7oqY7FKWhe0ilHDcli-DWpT9ldTFs).

Please download it to your Download folder. For example, to find this path on a Mac:

  

(WebAppEnv) $ cd ~/Downloads

(WebAppEnv) $ pwd

/Users/dalemcgrew/Downloads

  

In this example, the Android APK downloaded file is `app-debug-5-29-19.apk`. The full path to this downloaded file is now:

  

/Users/dalemcgrew/Downloads/app-debug-5-29-19.apk

  

So the terminal command to upload the file would look like this:

  

curl -u "YOUR-USERNAME:ACCESS-KEY-HERE" -X POST https://api-cloud.browserstack.com/app-automate/upload -F "file=@/Users/dalemcgrew/Downloads/app-debug-5-29-19.apk" -F 'data={"custom_id": "MyApp"}'

  

It will typically take 30-60 seconds to upload (without any feedback), and then return a path like this:

  

{"app_url":"bs://ANOTHER-GENERATED-STRING-HERE","custom_id":"MyApp","shareable_id":"dalemcgrew1/MyApp"}

  

Copy the path `bs://ANOTHER-GENERATED-STRING-HERE` into your `browserstack.config.js` file,

and put it into the `BROWSERSTACK_APK_URL` value field like this:

  

BROWSERSTACK_APK_URL: 'bs://ANOTHER-GENERATED-STRING-HERE',

  

With this `BROWSERSTACK_APK_URL` variable set now, we just need to specify the capabilities or devices that we plan to run our mobile app on. To do so, run:

  

```

(WebAppEnv) $ npm run wdio:setup

```

  

Any capabilities will be stored in [the `capabilities` directory](../../tests/browserstack_automation/capabilities/).

  

To run any tests in [the `specs` directory](../../tests/browserstack_automation/specs/), run:

  

(WebAppEnv) $ npm run wdio

When the test finishes, you should be able to see the video of browser tests on the BrowserStack Automate dashboard and video of the mobile apps on BrowserStack App Automate.

*To run any tests locally* (e.g. in case you have added id for an element and updated the corresponding page object file to use the newly added id as the element selector), you can run the test via BrowserStack on your locally hosted version of the WebApp as below:

(WebAppEnv) $ npm run wdio-local
[this will use the config file wdio.config.local.js which specifies we are using browserstackLocal: true, instead of the regular file wdio.config.js]
 Note: Update the  'WEB_APP_ROOT_URL' in the browserstack.config.js before triggering the test.
i.e. URL where your local version of the WebApp is running.

Additional useful options to run the tests:
1) Execute test for one specific spec file:
	(WebAppEnv) $ npm run wdio -- --spec [specs_dir_path]/[spec].js
	(WebAppEnv) $ npm run wdio-local -- --spec [specs_dir_path]/[spec].js
	
2) Execute test for one specific test case within a spec file:
	 (WebAppEnv) $  npm run wdio -- --spec [specs_dir_path]/[spec].js --mochaOpts.grep <test_name>
     (WebAppEnv) $  npm run wdio-local -- --spec [specs_dir_path]/[spec].js --mochaOpts.grep <test_name>
	 e.g. 
     npm run wdio-local -- --spec ./tests/browserstack_automation/specs/FAQPage.js --mochaOpts.grep  verifyLetsGetStartedLinkRedirected
---

  

[Go back to Readme Home](../../README.md)