RUN_TYPE: browser-desktop

Execution of 0 workers started at 2026-05-05T17:27:17.576Z

========== onPrepare - Starting setup for BrowserStack ==========
Skipping app upload (RUN_TYPE = browser-desktop)

========== Final Selected Capabilities for Test Run ==========
--- Capability 1 ---
{
  "browserName": "Chrome",
  "bstack:options": {
    "os": "Windows",
    "osVersion": "10",
    "browserVersion": "latest",
    "seleniumLogs": "true",
    "seleniumVersion": "4.11.0",
    "autoWait": 10,
    "networkLogs": "true",
    "consoleLogs": "info",
    "buildName": "Anuja Lawankar: Tue May 05 2026",
    "debug": "true",
    "gpsLocation": "37.804363,-122.271111",
    "idleTimeout": "300",
    "maskCommands": "setValues, getValues, setCookies, getCookies",
    "video": "true",
    "wdioService": "9.19.2"
  },
  "specs": [
    "../specs/SignInPage.browser.js"
  ]
}
-----------------------------
--- Capability 2 ---
{
  "browserName": "Safari",
  "bstack:options": {
    "os": "OS X",
    "osVersion": "Ventura",
    "browserVersion": "16.5",
    "seleniumLogs": "true",
    "seleniumVersion": "4.11.0",
    "autoWait": 10,
    "networkLogs": "true",
    "consoleLogs": "info",
    "buildName": "Anuja Lawankar: Tue May 05 2026",
    "debug": "true",
    "gpsLocation": "37.804363,-122.271111",
    "idleTimeout": "300",
    "maskCommands": "setValues, getValues, setCookies, getCookies",
    "video": "true",
    "wdioService": "9.19.2"
  },
  "specs": [
    "../specs/SignInPage.browser.js"
  ]
}
-----------------------------
========== onPrepare Completed ==========
[0-0] RUN_TYPE: browser-desktop
[0-0] RUNNING in Chrome - file:///tests/browserstack_automation/specs/SignInPage.browser.js
[0-0] (node:38687) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js?invalidateCache=0.3313541156796438 is not specified and it doesn't parse as CommonJS.
[0-0] Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
[0-0] To eliminate this warning, add "type": "module" to /Users/anujalawankar/MyProjects/WebApp/package.json.
[0-0] (Use `node --trace-warnings ...` to show where the warning was created)
[0-0] Error in "SignIn.verifyxSignInLinkResponsiveness"
Error: element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
    at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:121:5)
[0-0] Error in "SignIn.verifyTabKeyFunctionality"
Error: Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
    at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:90
    at async Object.executeCommand (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/util/executeCommand.js:2:20)
    at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:24
    at async waitUntil (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:36:43)
    at async Object.executeCommandBe (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:63:18)
    at async Object.toBeFocused (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/matchers/element/toBeFocused.js:9:20)
    at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:164:5)
[0-0] Platform: Windows XP
[0-0] Browser: chrome
[0-0] email value  CJHAFe@wevote.us
[0-0] email value  J655W3@wevote.us
[0-0] email value  LE.vV@wevote.us
[0-0] email value  Ik_iR@wevote.us
[0-0] email value  Nqb-QeZ@wevote.us
[0-0] email value  .Yfnc@wevote.us
[0-0] email value  @wevote.us
[0-0] email value  
[0-0] email value  yw.x.jW@wevote.us
[0-0] Testing email: S@w.us
[0-0] email length: 6
[0-0] Testing email: zuFyUcJLAKJOFrBYaxmNYVZTfIQTEZeRajOdMzmqZvTgSGEMwEwTNCSddPoCCFqBuzciXlqKtmMqIhsbAzgjwcwZyVxzAwakGEpfIydVmdaEPkisHEFPIDNostycPjOcBIkBTMrbtqdmvGLmDTKgxqEwUAikWlAsswAVpEyJTwqTICjUWxJLqJQEacfpuPYoDFhZKTQKnglFvDgLsCsrRzyGxDDaMRriplsyWXXrXEWJZGNYbMSf@wevote.us
[0-0] email length: 254
[0-0] Testing email: RFNbQOBZjHTaVVzWfGVkkVOgmbzZAoKeKcAGdsqcVUkQFZdnNZVAytrFnJrBcTDpUcZIJPTXtbDIckOjCEFcJYkDSnSutZePzbNVrBrAiVJgVnFWtuQsfilrGDbflyYlfawakpvkejBtQvAsBCoBWpnRvoVGcQbjVfsaloIYZECThRBMeBaBGgdUIeVlVnmZMzwGuvNMSgNiVlcZHjZDimznEGaUoQxtwPiuAkhDmavzcaIzWVcrq@wevote.us
[0-0] email length: 255
[0-0] FAILED in Chrome - file:///tests/browserstack_automation/specs/SignInPage.browser.js
[1-0] RUN_TYPE: browser-desktop
[1-0] RUNNING in Safari - file:///tests/browserstack_automation/specs/SignInPage.browser.js
[1-0] (node:38744) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js?invalidateCache=0.13453916930267706 is not specified and it doesn't parse as CommonJS.
[1-0] Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
[1-0] To eliminate this warning, add "type": "module" to /Users/anujalawankar/MyProjects/WebApp/package.json.
[1-0] (Use `node --trace-warnings ...` to show where the warning was created)
[1-0] Error in "SignIn.verifyxSignInLinkResponsiveness"
Error: element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
    at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:121:5)
[1-0] Error in "SignIn.verifyTabKeyFunctionality"
Error: Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
    at process.processTimers (node:internal/timers:538:9)
    at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:90
    at async Object.executeCommand (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/util/executeCommand.js:2:20)
    at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:24
    at async waitUntil (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:36:43)
    at async Object.executeCommandBe (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:63:18)
[1-0] Platform: mac
[1-0] Browser: Safari
[1-0] email value  KhgzrD@wevote.us
[1-0] email value  oNzFjG0@wevote.us
[1-0] email value  ra.bz@wevote.us
[1-0] email value  ua_MI@wevote.us
[1-0] email value  OaU-fpO@wevote.us
[1-0] email value  .oZYw@wevote.us
[1-0] email value  @wevote.us
[1-0] email value  
[1-0] email value  rf.g.Cs@wevote.us
[1-0] Testing email: z@w.us
[1-0] email length: 6
[1-0] Testing email: zXRPzVDISCPeXQsQVOuAZjVGTDvxxyQvVgRZNrYSQmXyKmiUFLihuULaDoYWBaTyhOOlpKMAzUZsotWKcofZhftdCYPOPBrwTknmjYTwJDUCVIkwjxKpfRmzxRcyRhjnYIGhjIktXSbuBwrUZLvfuEZdRXZODiYVhpFngzbNGJRKwnDStcPbwTbddHtXwLTUWXCHmRSLCPIveIJNxtDNgpGPJOMVgKJZcOeMrsAQRpDlfAipwpIG@wevote.us
[1-0] email length: 254
[1-0] Testing email: sWUbKIsMjrLiMUJZCJryOgmcSKFyffyflbdPVqNgMGfUnVqFgEnWPRCouRwfWKnThMwvchrAEzfkCsyiPxZSnwOvzxCJeXIZRlpRxMSwyWRqOdXPnhzqsDuolVxgVqZqnBlTIsXmsoxjJnZMogNgmFtFTbqdFQdimQPVxyPUNPlxFDmPhhDFHpvnhRkapmbiqJhdjUdQdZmfMGxnkhFcLyuOywnawlPDWYGgjBliOwpsYXxYpXuBK@wevote.us
[1-0] email length: 255
[1-0] FAILED in Safari - file:///tests/browserstack_automation/specs/SignInPage.browser.js

 "spec" Reporter:
------------------------------------------------------------------
[chrome 147.0.7727.56 Windows XP #0-0] Running: chrome (v147.0.7727.56) on Windows XP
[chrome 147.0.7727.56 Windows XP #0-0] Session ID: d5c85796edc6b4b87cf67acd60edcd27d5ac9d70
[chrome 147.0.7727.56 Windows XP #0-0]
[chrome 147.0.7727.56 Windows XP #0-0] » /tests/browserstack_automation/specs/SignInPage.browser.js
[chrome 147.0.7727.56 Windows XP #0-0] SignIn
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifySignInPage @BVT
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyAllIconsOnSignInPage
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyAllButtonsAndFieldsAlignedAndPresent @BVT
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ validateSendVerificationBttn
[chrome 147.0.7727.56 Windows XP #0-0]    ✖ verifyxSignInLinkResponsiveness
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyAppleSignInLinkResponsiveness
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyVisiblityOfPhoneAndEmailCancelAndSendBttn
[chrome 147.0.7727.56 Windows XP #0-0]    ✖ verifyTabKeyFunctionality
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldPasteFunctionalityUsingKeyboard
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldWithValidAddress
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldWithInvalidAddress
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsOnlyLatinLetters
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsLettersWithNum
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsLettersWithDecimal
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsLettersWithUnderscore
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsLettersWithDash
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldDoesntAcceptStartWithDot
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldDoesntAcceptStartWithDomain
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldWithBlank
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsLettersWithTwoDots
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyBackButtonOnVerificationPage
[chrome 147.0.7727.56 Windows XP #0-0]    ✓ verifyCancelButtonClearEmailField
[chrome 147.0.7727.56 Windows XP #0-0]
[chrome 147.0.7727.56 Windows XP #0-0] 23 passing (1m 50.6s)
[chrome 147.0.7727.56 Windows XP #0-0] 2 failing
[chrome 147.0.7727.56 Windows XP #0-0]
[chrome 147.0.7727.56 Windows XP #0-0] 1) SignIn verifyxSignInLinkResponsiveness
[chrome 147.0.7727.56 Windows XP #0-0] element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
[chrome 147.0.7727.56 Windows XP #0-0] Error: element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
[chrome 147.0.7727.56 Windows XP #0-0]     at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:121:5)
[chrome 147.0.7727.56 Windows XP #0-0]
[chrome 147.0.7727.56 Windows XP #0-0] 2) SignIn verifyTabKeyFunctionality
[chrome 147.0.7727.56 Windows XP #0-0] Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
[chrome 147.0.7727.56 Windows XP #0-0] Error: Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
[chrome 147.0.7727.56 Windows XP #0-0]     at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:90
[chrome 147.0.7727.56 Windows XP #0-0]     at async Object.executeCommand (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/util/executeCommand.js:2:20)
[chrome 147.0.7727.56 Windows XP #0-0]     at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:24
[chrome 147.0.7727.56 Windows XP #0-0]     at async waitUntil (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:36:43)
[chrome 147.0.7727.56 Windows XP #0-0]     at async Object.executeCommandBe (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:63:18)
[chrome 147.0.7727.56 Windows XP #0-0]     at async Object.toBeFocused (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/matchers/element/toBeFocused.js:9:20)
[chrome 147.0.7727.56 Windows XP #0-0]     at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:164:5)
------------------------------------------------------------------
[Safari 16.5.1 mac #1-0] Running: Safari (v16.5.1) on mac
[Safari 16.5.1 mac #1-0] Session ID: e76f8b4b30efd8da0f778f86524e0ef0884c258b
[Safari 16.5.1 mac #1-0]
[Safari 16.5.1 mac #1-0] » /tests/browserstack_automation/specs/SignInPage.browser.js
[Safari 16.5.1 mac #1-0] SignIn
[Safari 16.5.1 mac #1-0]    ✓ verifySignInPage @BVT
[Safari 16.5.1 mac #1-0]    ✓ verifyAllIconsOnSignInPage
[Safari 16.5.1 mac #1-0]    ✓ verifyAllButtonsAndFieldsAlignedAndPresent @BVT
[Safari 16.5.1 mac #1-0]    ✓ validateSendVerificationBttn
[Safari 16.5.1 mac #1-0]    ✖ verifyxSignInLinkResponsiveness
[Safari 16.5.1 mac #1-0]    ✓ verifyAppleSignInLinkResponsiveness
[Safari 16.5.1 mac #1-0]    ✓ verifyVisiblityOfPhoneAndEmailCancelAndSendBttn
[Safari 16.5.1 mac #1-0]    ✖ verifyTabKeyFunctionality
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldPasteFunctionalityUsingKeyboard
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldWithValidAddress
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldWithInvalidAddress
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsOnlyLatinLetters
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsLettersWithNum
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsLettersWithDecimal
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsLettersWithUnderscore
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsLettersWithDash
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldDoesntAcceptStartWithDot
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldDoesntAcceptStartWithDomain
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldWithBlank
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsLettersWithTwoDots
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[Safari 16.5.1 mac #1-0]    ✓ verifyEmailFieldAcceptsCharactersBetween6to254
[Safari 16.5.1 mac #1-0]    ✓ verifyBackButtonOnVerificationPage
[Safari 16.5.1 mac #1-0]    ✓ verifyCancelButtonClearEmailField
[Safari 16.5.1 mac #1-0]
[Safari 16.5.1 mac #1-0] 23 passing (3m 58.5s)
[Safari 16.5.1 mac #1-0] 2 failing
[Safari 16.5.1 mac #1-0]
[Safari 16.5.1 mac #1-0] 1) SignIn verifyxSignInLinkResponsiveness
[Safari 16.5.1 mac #1-0] element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
[Safari 16.5.1 mac #1-0] Error: element ("#twitterSignIn-splitIconButton") still not clickable after 10000ms
[Safari 16.5.1 mac #1-0]     at async Context.<anonymous> (file:///Users/anujalawankar/MyProjects/WebApp/tests/browserstack_automation/specs/SignInPage.browser.js:121:5)
[Safari 16.5.1 mac #1-0]
[Safari 16.5.1 mac #1-0] 2) SignIn verifyTabKeyFunctionality
[Safari 16.5.1 mac #1-0] Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
[Safari 16.5.1 mac #1-0] Error: Can't call isFocused on element with selector "#twitterSignIn-splitIconButton" because element wasn't found
[Safari 16.5.1 mac #1-0]     at process.processTimers (node:internal/timers:538:9)
[Safari 16.5.1 mac #1-0]     at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:90
[Safari 16.5.1 mac #1-0]     at async Object.executeCommand (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/util/executeCommand.js:2:20)
[Safari 16.5.1 mac #1-0]     at async file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:64:24
[Safari 16.5.1 mac #1-0]     at async waitUntil (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:36:43)
[Safari 16.5.1 mac #1-0]     at async Object.executeCommandBe (file:///Users/anujalawankar/MyProjects/WebApp/node_modules/expect-webdriverio/lib/utils.js:63:18)


Spec Files:	 0 passed, 2 failed, 0 total (0% completed) in 00:06:15  


Visit https://automation.browserstack.com/builds/pxuuqoccjkjfbtwzukzkercmvowwe5aoqax5ajzl to view build report, insights, and many more debugging information all at one place!

