# Testing WebApp - Overview of Process

## How to test Wevote WebApp with BrowserStack

If you haven't updated your dependencies in a while, run `npm install` to install or update [WebdriverIO](https://webdriver.io/), a framework that lets us test the browser app and Cordova mobile apps with a single script.

### Manual installation only

Copy `WebApp/tests/browserstack_automation/config/browserstack.config.template.js` into `WebApp/tests/browserstack_automation/config/browserstack.config.js`:

    (WebAppEnv) $ cd WebApp
    (WebAppEnv) $ cp tests/browserstack_automation/config/browserstack.config.template.js tests/browserstack_automation/config/browserstack.config.js
    
    
    Note [01/27/2026]: As the process of migrating to ESM is not completed for all the files [https://wevoteusa.atlassian.net/browse/WV-2254], we need to make changes in the 'browserstack.config.js' file for now. After you create the local file browserstack.config.js as a copy of browserstack.config.template.js, please update the below:
    module.exports = { browserStackConfig: {
    
    instead of
    export default {

### Automated installation start here

You'll need to add your credentials to `browserstack.config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press the down arrow next to where it says "Access Key" in the header. You should see your username ("YOUR-USERNAME" below) and access key ("ACCESS-KEY-HERE" below). You will need both of these values.

#### Preferred: Automated app download and upload workflow

We have a utility that automatically downloads apps from Google Drive. App upload to BrowserStack and URL injection happen at test runtime via wdio.config.js.

1. Set up your BrowserStack config:

       cp tests/browserstack_automation/config/browserstack.config.template.js tests/browserstack_automation/config/browserstack.config.js

   Add your `BROWSERSTACK_USER` and `BROWSERSTACK_KEY` to `browserstack.config.js`.

2. Set up your Google Drive config:

       cp tests/browserstack_automation/config/googleDrive.config.template.js tests/browserstack_automation/config/googleDrive.config.js

   Add the `FOLDER_URL` to your shared Drive folder containing the APK and IPA files.

3. Set up your Google Drive service account key:

       cp tests/browserstack_automation/config/googleDriveServiceAccountKey.template.json tests/browserstack_automation/config/googleDriveServiceAccountKey.json

   Add your service account JSON key (ask in slack channel for this).

4. Download the latest apps:

       npm run drive:download

   This downloads the latest `.apk` and `.ipa` into `tests/browserstack_automation/apps/`.

5. Run cordova tests - URL upload and injection happen automatically:

       npm run wdio-cordova

   The wdio.config.js onPrepare hook will upload apps to BrowserStack and inject URLs into capabilities at runtime.

#### Legacy: Manual app upload with curl

Alternatively, you can get the URL for the android app .apk file by uploading the file with Browserstack's REST API as described [here](https://www.browserstack.com/app-automate/rest-api?framework=appium).
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

```sh
(WebAppEnv) $ npm run wdio:setup
```

The above command adds capabilities for all available mobile devices that can be used for testing in mobile.json.
A subset of the capabilities from 'mobile.json' is added to 'cordova_mobile_devices.json'. This is based on the updated
device list that wevote supports. it's documented in 'https://docs.google.com/spreadsheets/d/1gJtgI6fTtpdNuwaX-gzNaTihpQ4BSIL8j5AQfu79QU4/edit?gid=415646806#gid=415646806'.
Look for the latest device list.
This list is also used to update devices in 'browser_mobile_devices.json'.

All capabilities will be stored in [the `capabilities` directory](../../tests/browserstack_automation/capabilities/).

Run scenarios for mobiles:
1.To run wevote mobile browser tests:
-update the capabilities in 'browser_mobile_devices.json' [see above steps]
-update 'WEB_APP_ROOT_URL' in 'config ->browserstack.config.js' to the wevote testing site as 'https://quality.wevote.us/ready'
-update the specs in wdio.config under 'mobileBrowserSpecs'
-use : (WebAppEnv) $ npm run wdio-browser-mobile
When the run finishes, results can be seen on browserstack dashboard under 'web->Automate'

2.To run wevote cordova tests:
-download latest apps: (WebAppEnv) $ npm run drive:download
-update the capabilities in 'cordova_mobile_devices.json' if needed [see above steps]
-update the specs in wdio.config under 'cordovaSpecs' if needed
-use : (WebAppEnv) $ npm run wdio-cordova
When the run finishes, results can be seen on browserstack dashboard under 'App->App Automate'

Note: BROWSERSTACK_APK_URL and BROWSERSTACK_IPA_URL are automatically injected at runtime by wdio.config.js, so no manual config updates are needed.

Run scenarios for desktop:

1. To run wevote desktop browser tests:
   -update the capabilities in 'browser_desktop.json'
   -update 'WEB_APP_ROOT_URL' in 'config ->browserstack.config.js' to the wevote testing site as 'https://quality.wevote.us/ready'
   -update the specs in wdio.config under 'desktopBrowserSpecs'
   -use : (WebAppEnv) $ npm run wdio-browser-desktop
   or
   -use : (WebAppEnv) $ npm run wdio

When the run finishes, results can be seen on browserstack dashboard under 'web->Automate'

p.s: In the above, specs for desktop browser and mobile browser will be same.
They use the same page files.

**Local Testing:**

To run any tests locally (For example, if you've added ID for an element and updated the corresponding page object file to use this new ID as the selector), you can run the test via BrowserStack on your locally hosted version of the WebApp as below:

(WebAppEnv) $ npm run wdio-local

[this will use the config file wdio.config.local.js which specifies that we are using browserstackLocal: true, instead of the regular file wdio.config.js]

Note: Update the 'WEB_APP_ROOT_URL' in the browserstack.config.js before triggering the test. i.e. URL where your local version of the WebApp is running.

**Additional useful options to run the tests**:

Execute test for one specific spec file:

(WebAppEnv) $ npm run wdio -- --spec [specs_dir_path]/[spec].js

(WebAppEnv) $ npm run wdio-local -- --spec [specs_dir_path]/[spec].js

Execute test for one specific test case within a spec file:

(WebAppEnv) $ npm run wdio -- --spec [specs_dir_path]/[spec].js --mochaOpts.grep <test_name>

(WebAppEnv) $ npm run wdio-local -- --spec [specs_dir_path]/[spec].js --mochaOpts.grep <test_name>

---

[Go back to Readme Home](../../README.md)
