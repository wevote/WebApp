<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [README for We Vote WebApp](#readme-for-we-vote-webapp)
  - [Contributing](#contributing)
  - [Install WeVoteServer First](#install-wevoteserver-first)
  - [Install nodeenv ("Node Env")](#install-nodeenv-node-env)
  - [Clone https://github.com/wevote/WebApp](#clone-httpsgithubcomwevotewebapp)
  - [Install and start web application](#install-and-start-web-application)
  - [After Installation: Working with WebApp Day-to-Day](#after-installation-working-with-webapp-day-to-day)
  - [Versions](#versions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# README for We Vote WebApp

[![Build Status](https://travis-ci.org/wevote/WebApp.svg?branch=develop)](https://travis-ci.org/wevote/WebApp) | 

This WebApp repository contains a Node/React/Flux Javascript application. Using data from
Google Civic API, Vote Smart, MapLight, TheUnitedStates.io and the Voting Information Project, we give voters a
social way to interact with ballot data.

You can see our current wireframe mockup for a San Francisco ballot here:
http://start.wevoteusa.org/

## Contributing
Please read our [Contributing guidelines](docs/contributing/index.md) before you start contributing to the project.

## Install WeVoteServer First
In order to get the data the WebApp needs, please 
[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md)


## Install nodeenv ("Node Env")

Install nodeenv globally. For instructions installing it locally, see: https://github.com/ekalinin/nodeenv

    $ cd ~
    $ sudo pip install nodeenv

Create a place for your WebApp virtual environment to live on your hard drive. We recommend installing it
away from the WebApp source code:

    $ mkdir /Users/<YOUR NAME HERE>/NodeEnvironments/
    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/

Now create a new virtual environment in that 'NodeEnvironments' folder. This can take many minutes.

    $ nodeenv WebAppEnv

Now activate this new virtual environment:

    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/WebAppEnv/
    $ . bin/activate

Confirm the versions of your main packages are >= to these versions:

    (WebAppEnv) $ node -v
    v5.3.0

    (WebAppEnv) $ npm -v
    3.3.12


## Clone https://github.com/wevote/WebApp

Create a place to put all of the code from Github:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

Retrieve “WebApp” into that folder, so your code ends up here:

    /Users/<YOUR NAME HERE>/MyProjects/WebApp


## Install and start web application

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm -g install gulp-cli      // try sudo if it does not work
    (WebAppEnv) $ npm install
    (WebAppEnv) $ gulp

You should be able to visit WebApp here:

    http://localhost:3000


## After Installation: Working with WebApp Day-to-Day

[Read about working with WebApp on a daily basis](README_WORKING_WITH_WEB_APP.md)

## Versions

Please read about how we version the app vs releases - [versions vs releases](docs/contributing/versions/index.md)
