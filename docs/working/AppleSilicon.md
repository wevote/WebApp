# Apple Silicon on macOS Big Sur 11 beta, October 9, 2020

Will remove these notes once Big Sur is released, and Apple Silicon (iOS app running on the desktop) is stable.

1. Safari on Big Sur can not currently inspect "My Mac" targets, so the weak xCode console is all we have for now.  
See Apple [Universal App Quick Start] private forum [662281](https://developer.apple.com/forums/thread/662281?login=true).  Also
an Apple Beta Feedback Assistant issue, for Big Sur beta 8, has been lodged (FB8755308) titled "No Inspectable Applications" in Safari Debug Menu for targets with "My Mac" -- No response yet from Apple.  
1. node-sass is tied to macOS versions, so it is not available for Big Sur yet.  Hopefully we will design it out 
of the "WeVote Web App" this year.  In the meantime, we need to build main.css on an intel Mac, and copy it to the 
Apple Silicon (ARM64) mac in order to have all the legacy styles work.
Manual changes have to be made to package.json and webpack.config.js on the ARM64 Mac to remove
node-sass from the build.
1. Firebase is not ready for Big Sur, so it has to be manually removed from WeVoteCordova, so we lose notifications
in iOS until it is ready.  Remove "cordova-plugin-firebase-analytics" and "cordova-plugin-firebase-messaging" to stop compile errors on the ARM64 DTK.
1. cordova.plugins.diagnostic has been added to detect which processor the app is running on.
1. A forked version of cordova-plugin-device is needed, to return the native code c++ variable `isIOSAppOnMac` so we can determine
`isIOSAppOnMac()`.  It is a small change, and I'll submit a PR to Apache, to see if they will adopt it.
1. The Sign in with Twitter and Facebook are currently unavailable since there is a problem where opening a "tab" with corodova-plugin-inappbrowser
opens an empty modal dialog, and then opens the actual URL you send it in a tab in the Safari desktop browser, breaking oAuth 
flow. See [Universal App Quick Start] private forum issue [662697](https://developer.apple.com/forums/thread/662697)
