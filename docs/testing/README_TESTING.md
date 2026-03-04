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

You'll need to add your credentials to `browserstack.config.js`. Sign into Browserstack and navigate to the [BrowserStack Automate dashboard](https://automate.browserstack.com/). Press the down arrow next to where it says "Access Key" in the header. You should see your username ("YOUR-USERNAME" below) and access key ("ACCESS-KEY-HERE" below). You will need both of these values to upload the compiled App.

#### Preferred: automated app upload

We now have a utility that downloads the latest apps from Google Drive, uploads them to BrowserStack, and updates the config files.

1. Create your local BrowserStack config from the template:

       cp tests/browserstack_automation/config/browserstack.config.template.js tests/browserstack_automation/config/browserstack.config.js

   Then put your `BROWSERSTACK_USER` and `BROWSERSTACK_KEY` values into `browserstack.config.js`.

2. Create your local Google Drive config from the template:

       cp tests/browserstack_automation/config/googleDrive.config.template.js tests/browserstack_automation/config/googleDrive.config.js

   - Set `FOLDER_URL` to the shared Drive folder that contains the latest APK and IPA.
   - Optionally adjust `LIST_TIMEOUT_MS` and `LIST_PAGE_SIZE` if needed.

3. Create your local Google Drive service account key file from the template:

       cp tests/browserstack_automation/config/googleDriveServiceAccountKey.template.json tests/browserstack_automation/config/googleDriveServiceAccountKey.json

   - Ask your admin or project owner for the real service account JSON key and paste its contents into `googleDriveServiceAccountKey.json`.
   - Make sure the Drive folder is shared (Viewer access is enough) with that service account.

4. To download the latest APK/IPA from Drive into the apps folder and upload them to BrowserStack, run:

       npm run browserstack:sync-apps

   This will:
   - Download the latest `.apk` and `.ipa` from the Drive folder into `tests/browserstack_automation/apps/`.
   - Upload the newest `.apk` and `.ipa` in that folder to BrowserStack.
   - Update `BROWSERSTACK_APK_URL` and `BROWSERSTACK_IPA_URL` in `browserstack.config.js`.
   - Update the app URLs in `tests/browserstack_automation/capabilities/cordova_mobile_devices.json`.

#### Legacy: manual app upload with curl

If you cannot use the automated script above, you can still upload apps manually.

You will need the URL for the android app .apk file. You can get this by asking someone else or by uploading the file with Browserstack's REST API as described [here](https://www.browserstack.com/app-automate/rest-api?framework=appium).
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
-update the capabilities in 'cordova_mobile_devices.json' [see above steps]
-update 'BROWSERSTACK_APK_URL', 'BROWSERSTACK_IPA_URL' in 'config ->browserstack.config.js' [ see above on how to generate the app urls ]
-update the specs in wdio.config under 'cordovaSpecs'
-use : (WebAppEnv) $ npm run wdio-cordova
When the run finishes, results can be seen on browserstack dashboard under 'App->App Automate'

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
