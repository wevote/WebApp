<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Running WebApp for the First Time](#running-webapp-for-the-first-time)
  - [Install and start web application](#install-and-start-web-application)
  - [Using We Vote API server Locally](#using-we-vote-api-server-locally)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Running WebApp for the First Time

Please make sure you have read:

* [Preparing the Environment on Your Machine](docs/installing/ENVIRONMENT.md)

* [Bringing Code to Your Machine](docs/installing/CLONING_CODE.md)

## Install and start web application

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm -g install gulp-cli      // try sudo if it does not work
    (WebAppEnv) $ npm install
    (WebAppEnv) $ gulp

You should be able to visit WebApp here:

    http://localhost:3000


## Using We Vote API server Locally

The default configuration connections to our live API server at: https://api.wevoteusa.org

IFF you would like to install the We Vote API server locally, start by reading the instructions 
[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md)


---

Next: [Working with WebApp Day-to-Day](../working/README_WORKING_WITH_WEB_APP.md)

[Go back to Readme Home](../../README.md)
