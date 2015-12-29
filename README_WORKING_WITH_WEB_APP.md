# Working with WebApp

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


## Coding Standards

Please use descriptive full word variable names.

* In the lifecycle of most projects, fixing bugs and maintaining current features end up taking 
50%+ of total engineering time.
* Our goal is to create a code base that is easy to understand, making fixing bugs and maintaining 
current features as painless as possible. We will have many engineers working with this code, 
and we want to be welcoming to engineers who are new to the project.
* Short variable names can often create confusion, where a new engineer needs to spend time 
figuring out what a short variable name actually means. (Ex/ “per” or “p” instead of “person”.) 
For this project please use descriptive full word variable names.
* Fellow engineers should be able to zoom around the code and not get stopped with riddles created by short names.

## Checking In Code

Before checking in your code:

Request access to the We Vote team so you can check in code. Email: Dale.McGrew@WeVoteUSA.org

