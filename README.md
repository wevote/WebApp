#We Vote USA Web/Mobile Web Application

![WeVoteUS](wevotelogo.png) 

[![Build Status](https://travis-ci.org/wevote/WebApp.svg?branch=develop)](https://travis-ci.org/wevote/WebApp) | 

This WebApp repository contains a Node/React/Flux Javascript application. Using data from
Google Civic API, Vote Smart, MapLight, TheUnitedStates.io and the Voting Information Project, we give voters a
social way to interact with ballot data.

You can see our current wireframe mockup for a San Francisco ballot here:
http://start.wevoteusa.org/

## Getting started

1. Fork the repository to your GitHub repo.
2. Clone your repository to your local machine
3. **Always** start from the develop branch
4. When working on features or hotfixes, created a new branch and push those for pull requests - [See contributing for more](CONTRIBUTING.md)
5. Request a pull request. If there is an issue that the pull request is tried to, include the number of the issue in your description.

Before starting local development, confirm the versions of your main packages are >= to these versions:

    $ node -v
    v5.3.0

    $ npm -v
    3.3.12

## Install and start web application

    $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    $ npm -g install gulp-cli      // try sudo if it does not work
    $ npm install
    $ gulp

You should be able to visit WebApp here:

    http://localhost:3000

## Using WeVote Backend Locally
First, start by reading the instructions[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md)

## SemVer

We follow [SemVer](http://semver.org/) for our releases. Please read if you plan
to tag for any releases.
