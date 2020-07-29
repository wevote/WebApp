# Testing WebApp - Overview of Process

## Minimum Browsers

[Click here to see the minimum browser versions](https://docs.google.com/spreadsheets/d/1FlUMCvg1pNIO0IzJm0jQyvUW1YC_KHh-LO4l-OVIcog/edit#gid=1774503729) 
that we support.

## How to test Wevote WebApp with BrowserStack

If you haven't updated your dependencies in a while, run `npm install` from your terminal to install WebdriverIO (this is a framework that lets us test both the browser app and Cordova mobile apps with a single script). 

### Manual installation only

Copy `WebApp/tests/browserstack/browserstack.config-template.js` into `WebApp/tests/browserstack/browserstack.config.js`:

    (WebAppEnv) $ cd WebApp
    (WebAppEnv) $ cp tests/browserstack/browserstack.config-template.js tests/browserstack/browserstack.config.js

### Automated installation start here

You'll need to add your credentials to `browserstack.config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press the down arrow next to where it says "Access Key" in the header. You should see your username ("YOUR-USERNAME" below) and access key ("ACCESS-KEY-HERE" below). You will need both of these values to upload the compiled App.

You will also need the URL for the android app .apk file. You can get this by asking someone else or by uploading the file with Browserstack's REST API as described [here](https://www.browserstack.com/app-automate/rest-api?framework=appium).
Visit this page when you are signed into Browserstack, and they will customize the command that you need to run from your terminal window:

    curl -u "YOUR-USERNAME:ACCESS-KEY-HERE" -X POST https://api-cloud.browserstack.com/app-automate/upload -F "file=@/path/to/app/file/Application-debug.apk" -F 'data={"custom_id": "MyApp"}'

You can find the latest We Vote APK (for Android) and IPA (for iOS) in [this Google Drive folder](https://drive.google.com/drive/u/0/folders/10tK7oqY7FKWhe0ilHDcli-DWpT9ldTFs).
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

Copy the path `bs://ANOTHER-GENERATED-STRING-HERE` into your `WebApp/tests/browserstack/browserstack.config.js` file,
and put it into the `BROWSERSTACK_APK_URL` value field like this:

    BROWSERSTACK_APK_URL: 'bs://ANOTHER-GENERATED-STRING-HERE',

With this `BROWSERSTACK_APK_URL` variable set now, we can run tests on the android mobile application.

There are three scripts for running tests: config.py, testscript, and wdio.config.js. testScript generates the template file named wdio.config.template which acts as a template for creating wdio.config.js. config.py uses the wdio.config.template file to generate the wdio.config.js file, which is used for running the test.  

    (WebAppEnv) $ ./testscript -s <script name> -n <number of tests> (run without options for help)
    (WebAppEnv) $ python config.py -s <script name> -b <type of device> -n <number of tests> (-h for help) 

To run the tests, run:

    (WebAppEnv) $ wdio wdio.config.js
    
When the test finishes, you should be able to see the video of browser tests on the BrowserStack Automate dashboard and video of the mobile apps on BrowserStack App Automate.

[//]: <> ( ## User Interaction Automated Testing with SauceLabs and Selenium)

[//]: <> ( (This is where we imitate a Voter interacting with our website. )
[//]: <> ( (In Travis we automate this with a Travis powered test with every pull request. )
[//]: <> ( (In Travis, we reach out to Sauce Labs, and have them run tests recorded with Selenium.)

[//]: <> (Configuration in WebApp/.travis.yml and WebApp/tests/selenium/interpreter_config.json)

[//]: <> (Please see /tests/selenium)

[//]: <> (## Component automated testing)

[//]: <> (This is where we test one component at a time. )
[//]: <> (Currently in Travis we automate this with a Travis powered test with every pull request. )

[//]: <> (Configuration in WebApp/.travis.yml and WebApp/package.json)

[//]: <> (Developers can run “npm run autoTest”)

[//]: <> (What are the components we want to test separately from user interaction testing?)
[//]: <> (/src/js/components/AddressBox.jsx)

---

[Go back to Readme Home](../../README.md)
