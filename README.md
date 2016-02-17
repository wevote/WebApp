# README for We Vote WebApp

![WeVoteUS](wevotelogo.png) 

[![Build Status](https://travis-ci.org/wevote/WebApp.svg?branch=develop)](https://travis-ci.org/wevote/WebApp) | 

This WebApp repository contains a Node/React/Flux Javascript application. Using data from
Google Civic API, Vote Smart, MapLight, TheUnitedStates.io and the Voting Information Project, we give voters a
social way to interact with ballot data.

You can see our current wireframe mockup for a San Francisco ballot here:
http://start.wevoteusa.org/

## Contributing
Please read our [Contributing guidelines](docs/contributing/index.md) before you start contributing to the project.

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
    
## Overview of Process

1. Fork the repository to your GitHub repo.
2. Clone your repository to your local machine
3. **Always** start from the develop branch
4. When working on features or hotfixes, created a new branch and push those for pull requests - [See contributing for more](CONTRIBUTING.md)
5. Request a pull request. If there is an issue that the pull request is tried to, include the number of the issue in your description.

## Set up your environment

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

## Using We Vote API server Locally

The default configuration connections to our live API server at: https://api.wevoteusa.org 
If you would like to install the We Vote API server locally, start by reading the instructions[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md)

## After Installation: Working with WebApp Day-to-Day

[Read about working with WebApp on a daily basis](README_WORKING_WITH_WEB_APP.md)

## SemVer

We follow [SemVer](http://semver.org/) for our releases. Please read if you plan
to tag for any releases.
