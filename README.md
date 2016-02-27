# We Vote WebApp

[![Build Status](https://travis-ci.org/wevote/WebApp.svg?branch=develop)](https://travis-ci.org/wevote/WebApp)

![WeVoteUS](unclesamewevote.jpg)

This WebApp repository contains a Node/React/Flux Javascript application. Using data from
Google Civic API, Vote Smart, MapLight, TheUnitedStates.io and the Voting Information Project, we give voters a
social way to interact with ballot data.

You can see our current wireframe mockup for a San Francisco ballot here:
http://start.wevoteusa.org/

## Contributing
Please read our [Contributing guidelines](docs/contributing/index.md) before you start contributing to the project.  
For best practices, please read [how to fork and create pull requests](CONTRIBUTING.md).

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

## Viewing server logs
  If you would like to see the server logs while developing, you can follow these steps.

### Get an SSH key
  1. If you already have an SSH key you'd like to use, skip to the next section. Otherwise...
  2. Open a terminal on your local computer and enter the following: ssh-keygen -t rsa -C "your_email@example.com" ...
  3. Just press <Enter> to accept the default location and file name. ...
  4. Enter, and re-enter, a passphrase when prompted. ...
  5. You're done!

### Get authorized and log in:
  1. Run cd ~/.ssh/ at the command line.
  3. Copy the contents of the file id_rsa.pub (your public key).
  4. Email the key to servers@wevoteusa.org.
  5. You will receive an email with a command to login (ssh <username>@ec2-52-32-204-163.us-west-2.compute.amazonaws.com)
  6. Run the command, if prompted 'Are you sure you want to continue?' Type yes.
  7. You should now be logged in.

### Viewing Server Logs
1. To view server errors, run tail -F /var/log/wevote/wevoteserver.log
2. To view all the server activity, run tail -F /var/log/upstart/wevote-api.log
3. To only view activity that is coming from localhost:3000 on your computer, run tail -F /var/log/upstart/wevote-api.log | grep <voter_device_id>
4. Note: You can get your device_id by navigating to localhost:3000, opening chrome developer tools and finding the cookie labeled voter_device_id (under Resources > Cookies > Localhost)


## Using We Vote API server Locally

The default configuration connections to our live API server at: https://api.wevoteusa.org
If you would like to install the We Vote API server locally, start by reading the instructions[install WeVoteServer](https://github.com/wevote/WeVoteServer/blob/master/README_API_INSTALL.md)

## After Installation: Working with WebApp Day-to-Day

[Read about working with WebApp on a daily basis](README_WORKING_WITH_WEB_APP.md)

## SemVer

We follow [SemVer](http://semver.org/) for our releases. Please read if you plan
to tag for any releases.

Welcome aboard!!

