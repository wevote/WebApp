<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Creating a Pull Request](#creating-a-pull-request)
  - [Get Your Command Line Ready](#get-your-command-line-ready)
  - [Preparing to Create a Branch](#preparing-to-create-a-branch)
  - [How to Create a Branch in Your Personal Fork](#how-to-create-a-branch-in-your-personal-fork)
  - [How to Merge in “develop” Branch Changes While you are Working](#how-to-merge-in-%E2%80%9Cdevelop%E2%80%9D-branch-changes-while-you-are-working)
  - [Test Before Creating Pull Request](#test-before-creating-pull-request)
  - [Commit:](#commit)
    - [Commit Hints](#commit-hints)
    - [For large changes spanning many commits / Pull Requests](#for-large-changes-spanning-many-commits--pull-requests)
    - [PR Merge Exception](#pr-merge-exception)
  - [How to Put Your Changes on your Personal Fork on the github servers](#how-to-put-your-changes-on-your-personal-fork-on-the-github-servers)
  - [Submitting your Pull Request](#submitting-your-pull-request)
  - [SemVer](#semver)
  - [I Have Submitted a Pull Request, Now What?](#i-have-submitted-a-pull-request-now-what)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Creating a Pull Request

If you have never created a pull request, please read “[What the Heck is a Pull Request?](PULL_REQUEST_BACKGROUND.md)
We also created [this handy chart](https://docs.google.com/drawings/d/1ED4X3Gpy_UruGDSiO8FjjxQeGOmQqIApguodHDo6-ok/edit) 
to show the various steps working with pull requests.

## Get Your Command Line Ready

`cd /Users/DaleMcGrew/NodeEnvironments/WebAppEnv/`  # Activate your node environment

`. bin/activate`

`cd /Users/DaleMcGrew/PythonProjects/PersonalGitForks/WebApp`  # Change to directory where you checked out your Personal Fork from github

## Preparing to Create a Branch

`git branch -a`  # See what branch you are currently set to

`git checkout develop`  # If you aren’t set to the develop branch, switch to that

`git pull upstream develop`  # Tell your personal fork on your local machine to get the latest from wevote/WebApp

`git push origin develop`  # Push this latest version of develop up to your Personal Fork on the github servers

You can see changes here: https://github.com/DaleMcGrew/WebApp

## How to Create a Branch in Your Personal Fork
We want to set up a branch on your local computer.

`git checkout -b <your-feature-branch>`  # The “-b” creates the new branch.  
Replace "<your-feature-branch>" with your branch name.

In PyCharm: Right click WebApp > Git > Repository > Branches > New Branch

## How to Merge in “develop” Branch Changes While you are Working

`git fetch` # Sync your changes with what's upstream

`git branch -a`  # See what branch you are currently set to

`git checkout develop`  # If you aren’t set to the develop branch, switch to that

`git pull upstream develop`  # Tell your personal fork on your local machine to get the latest from wevote/WebApp

`git push origin develop`  # Push this latest version of develop up to your Personal Fork on the github servers

`git checkout <your-feature-branch>`  # Replace "<your-feature-branch>" with your branch name 

Now you need to merge locally the latest code from "develop" with your branch name. Dale does this merging with 
the PyCharm IDE. How you do this depends on the development environment you use. 
TODO: Add instructions for merging with develop via command line

## Test Before Creating Pull Request
We use a tool that verifies our Javascript meets the eslint spec.

    `npm test`
    
You may get warnings or errors. Please minimally fix the errors, and try to fix all of the warnings in files you are changing.


## Commit:
* Make sure you comply with the [.editorconfig](http://editorconfig.org/) 
Reference the issue number in your commit message e.g.:

```
git commit -m '[Issue #<your-issue-number>] <short description of change>'
```

or

```
git commit -a
```

or

`git commit -p`  # Commit all of your changes

or 

`git commit FILENAME` and then individually add files with `git add`  


## How to Put Your Changes on your Personal Fork on the github servers

`git branch -a`  # Make sure you are looking at the branch you want to push

`git push origin <your-feature-branch>`  # Push your changes to your Personal Fork on the github servers

You can go to the github web page for your Personal Fork and make sure it shows up in “recently pushed branches"

## Submitting your Pull Request
* Open your repository fork on GitHub
* You should see a button to create a pull request - Press it
* Consider mentioning a contributor in your pull request comments to alert them that it's available for review
* Please don't merge your own changes. Create a pull request so others can review the changes.
* **Wait for the reviewer to approve and merge the request**

This guide walks through the process of sending a hypothetical pull request and using the various code review 
and management tools to take the change to completion.
https://help.github.com/articles/using-pull-requests/


### For large changes spanning many commits / Pull Requests

* Create a meta-issue with a bullet list using the `* [ ] item` markdown syntax.
* Create issues for each bullet point
* Link to the meta-issue from each bullet point issue
* Check off the bullet list as items get completed

Linking from the bullet point issues to the meta issue will create a list of issues with status indicators 
in the issue comments stream, which will give us a quick visual reference to see what's done and what still needs doing.


### PR Merge Exception

* Minor documentation grammar/spelling fixes (code example changes should be reviewed)


## SemVer

We follow [SemVer](http://semver.org/) for our releases. Please read if you plan to tag for any releases.


## I Have Submitted a Pull Request, Now What?
Sometimes pull requests can take a day or two to be approved. How do you keep working? TODO discuss this.

While your pull request is being considered by the We Vote admins:
Any new changes unrelated to this one should be on a brand new branch (`git
checkout -b <your-second-feature-branch>`). Don't forget to check out the develop branch first, otherwise you'll 
branch off of the current PR branch

If you want to make changes to your earlier commit in response to comments on
the pull request, you change back to the branch that you submitted it from (`git
checkout <your-feature-branch>`), make any changes, then commit and push them (steps 6-9). 
These get automatically added to your pull request since they're in the same branch.

If your changes are small fixes, they should not be a new commit. Instead, use
git add and then `git commit --amend` to fix up your original commit. 

If you decide to abandon a pull request, you can CLOSE the issue it created and ignore it.  

If the pull request is good, there's nothing else for you to do, besides wait for someone to accept it. 

Moving a change between branches
Sometimes you make a change on the wrong branch. You can move it to the right branch with git stash. 
From the branch where you made the changes:

`git stash`

`git checkout branch-you-want-it-on`

`git stash pop`

## My Pull Request Was Approved

Once the pull request is accepted (or closed) you can delete your branch from the client. 
Or, you can wait until you have collected a bunch of them and delete all of the obsolete ones in one go. 
For example with the branch "dale_doc_updates_mar24":

`git branch -D <your-feature-branch>`

Also keep in mind that `git branch -D my-branch` deletes branches only locally, 
to delete them from the remote repo you have to do `git push origin :my-branch`

or 

`git push origin --delete <your-feature-branch>`

`git remote prune origin`

---

For more advanced tips about using Pull Requests, see [Pull Request Tips & Tricks](PULL_REQUEST_ADVANCED.md)

See also [Troubleshooting Pull Request Problems](PULL_REQUEST_TROUBLESHOOTING.md)

See also [Approving Pull Requests](APPROVING_PULL_REQUESTS.md)

[Go back to Readme Home](../../README.md)
