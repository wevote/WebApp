<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Working with WebApp Day-to-Day](#working-with-webapp-day-to-day)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Working with WebApp Day-to-Day

If you are returning to work on WebApp and other developers have made changes, follow these steps.

Update WeVoteServer first (the code that powers the Django/Python API Endpoints). [See instructions here](https://github.com/wevote/WeVoteServer/blob/master/README_WORKING_WITH_WE_VOTE_SERVER.md)

Grab the latest code from https://github.com/wevote/WebApp

Activate the virtual environment:

    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/WebAppEnv/
    $ . bin/activate

Install changes and start web application

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm install
    (WebAppEnv) $ npm start

You should be able to visit WebApp here:

    http://localhost:3000

# How to Update to Latest Changes from “develop” Branch

Lets assume you are working on a branch called "dale_work_feb28". Ctrl-C to stop npm from running. Then:

`(WebAppEnv) $ git branch -a`  # See what branch you are currently set to (look for "*" on left of listing)

`(WebAppEnv) $ git checkout develop`  # If you aren’t set to the develop branch, switch to that

`(WebAppEnv) $ git pull upstream develop`  # Tell your personal fork on your local machine to get the latest from wevote/WebApp

`(WebAppEnv) $ git push origin develop`  # Push this latest version of develop up to your Personal Fork on the github servers

`(WebAppEnv) $ git checkout -b <your-feature-branch>`

Now you need to merge locally the latest code from "develop" with your branch name. Dale does this merging with 
the PyCharm IDE. How you do this depends on the development environment you use. 

Restart web application

    (WebAppEnv) $ npm install
    (WebAppEnv) $ npm start

We have created <a href="https://docs.google.com/drawings/d/1ED4X3Gpy_UruGDSiO8FjjxQeGOmQqIApguodHDo6-ok/edit" target="_blank">this diagram</a> (opens in a new window) to show the typical flow when preparing a pull request.

---

Next: [Debugging Tools and Tips](DEBUGGING_TOOLS.md)

[Go back to Readme Home](../../README.md)
