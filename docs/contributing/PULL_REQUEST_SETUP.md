<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Before Your First Pull Request](#before-your-first-pull-request)
  - [Get Your Command Line Ready](#get-your-command-line-ready)
  - [Connect Your Personal Fork To wevote/WebApp](#connect-your-personal-fork-to-wevotewebapp)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Before Your First Pull Request

Thank you for your interest in the We Vote WebApp project. Please let us know if we can help you get started.
 (contact info: https://github.com/wevote)

This document includes the steps you need to take before your first We Vote pull request. 
We recommend reading “[What the Heck is a Pull Request?](PULL_REQUEST_BACKGROUND.md)” before following these steps. 

Please [sign the Contributor License Agreement](https://www.clahub.com/agreements/wevote/WebApp) before getting started.


## Get Your Command Line Ready
`cd /Users/DaleMcGrew/NodeEnvironments/WebAppEnv/`  # Activate your node environment

`. bin/activate`

`cd /Users/DaleMcGrew/PythonProjects/PersonalGitForks/WebApp`  # Change to directory where you checked out your Personal Fork from github

Before creating a branch to work in, first make sure you’re on your local
   master branch `git checkout master`  

Next, make sure that master is in sync with the upstream source of truth:
   `git fetch upstream` and then `git rebase upstream/master` Or, if you prefer
	`git pull upstream master --rebase`  


## Connect Your Personal Fork To wevote/WebApp

Make sure your are connecting this way:
`vi .git/config`

Replace the “url” connection string under [remote “origin”] with:
`url = git@github.com:YOUR_GITHUB_ACCOUNT/WebApp.git`

Make sure your `[remote “upstream”]` lines look like this:

    [remote "upstream"]
            url = git@github.com:wevote/WebApp.git
            fetch = +refs/heads/*:refs/remotes/upstream/*
        
Run this command to confirm your setup:
`git remote -v`

You should see:

    origin    git@github.com:YOUR_GITHUB_ACCOUNT/WebApp.git (fetch)
    origin    git@github.com:YOUR_GITHUB_ACCOUNT/WebApp.git (push)
    upstream    git@github.com:wevote/WebApp.git (fetch)
    upstream    git@github.com:wevote/WebApp.git (push)

---

Next: [Creating a Pull Request](CREATING_PULL_REQUEST.md)

[Go back to Readme Home](../../README.md)
