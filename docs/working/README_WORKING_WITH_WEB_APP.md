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




---

Next: [Debugging Tools and Tips](DEBUGGING_TOOLS.md)

[Go back to Readme Home](../../README.md)
