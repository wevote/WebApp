<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Contributing to wevote/WebApp](#contributing-to-wevotewebapp)
  - [Pull Requests](#pull-requests)
    - [Setting up your repository for work](#setting-up-your-repository-for-work)
    - [Some useful tips and tricks](#some-useful-tips-and-tricks)
    - [Git completion](#git-completion)
    - [Prompt](#prompt)
      - [How to get a change from someone’s repository into your repo before it’s pushed to master](#how-to-get-a-change-from-someone%E2%80%99s-repository-into-your-repo-before-it%E2%80%99s-pushed-to-master)
      - [How to get rid of garbage files that shouldn’t be in git](#how-to-get-rid-of-garbage-files-that-shouldn%E2%80%99t-be-in-git)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contributing to wevote/WebApp

Thank you for your interest in the We Vote WebApp project. Please let us know if we can help you get started.
 (contact info: https://github.com/wevote)

To get started, [sign the Contributor License Agreement](https://www.clahub.com/agreements/wevote/WebApp)

This README outlines the proper ways to contribute to the project. 
(Feb 13, 2016 Update: This process is still a work-in-progress.)

## Pull Requests

**Things to never ever do (or at least try to avoid)**

Especially if you have commit access to an Angular repository

1.don't make changes to master, always start a new branch.  
2.don’t merge. It messes up the commit history.  
3.don’t pull upstream without a rebase (see above). git fetch and then rebase
  instead (or equivalently, `git pull upstream master --rebase`).   
4.don’t use `git commit -a`. You could silently commit something regrettable. Use -p instead.

### Setting up your repository for work

1.Install and configure git on your local machine.  
2.Create a fork of wevote/WebApp.git  
3.Clone your fork  
`git clone https://github.com/username/WebApp.git`  
4.In your local repository, set up a remote for upstream:  
`$ git remote add upstream git@github.com:wevote/WebApp.git`  
5.Create ssh keys: `ssh-keygen -t rsa -C "youremail@somedomain.com"`  
6.`ssh-add ~/.ssh/id_rsa`  
7.`pbcopy < ~/.ssh/id_rsa.pub`  
8.Go paste your keys into Github, under SSH Keys for your account.  
9.Set up a git client where origin is a fork of the repository (e.g.
  pertrai1/WebApp), and upstream is the real deal (e.g. wevote/WebApp) 
10.Before creating a branch to work in, first make sure you’re on your local
   master branch `git checkout master`  
11.Next, make sure that master is in sync with the upstream source of truth:
   `git fetch upstream` and then `git rebase upstream/master` Or, if you prefer
	`git pull upstream master --rebase`  
    
Note: if there’s a conflicting commit in the history of your master branch, you
can destroy your branch and replace it with a fresh copy using the command  `git
checkout -B master upstream/master`.  

12. Now create a new branch `git checkout -b doc-script-changes`  
13. On the new branch, make edits to the files.   

Note: Time passes, stuff changes in the upstream repo....  
Commit your changes with `git commit -p`, or git commit and individually add
files with `git add`  

To sync your changes with what's upstream, `git fetch`.   

To make sure your commit goes in at the top of everything else on the upstream
repo, rebase: `git rebase upstream/master`  

If there are conflicts, open the file and look for the diff markers, resolve, and continue.

Send your changes to your forked copy of the repo in the appropriate branch:
`git push -f origin doc-script-changes`.  

In the web client, go to your fork of the repo, and initiate a pull request by pushing the Pull Request button. Submit the pull request!

While the pull request is out for consideration:
Any new changes unrelated to this one should be on a brand new branch (`git
checkout -b some-new-thing`). Don't forget to check out the master branch first, otherwise you'll branch off of the current PR branch

If you want to make changes to your earlier commit in response to comments on
the pull request, you change back to the branch that you submitted it from (`git
checkout doc-script-changes`), make any changes, then commit and push them (steps 6-9). These get automatically added to your pull request since they're in the same branch.

If your changes are small fixes, they should not be a new commit. Instead, use
git add and then `git commit --amend` to fix up your original commit. 

If you decide to abandon a pull request, you can CLOSE the issue it created and ignore it.  

If the pull request is good, there's nothing else for you to do, besides wait for someone to accept it. 

Once the pull request is accepted (or closed) you can delete your branch from the client. Or, you can wait until you have collected a bunch of them and delete all of the obsolete ones in one go.

Also keep in mind that `git branch -D my-branch` deletes branches only locally, to delete them from the remote repo you have to do `git push origin :my-branch`

Moving a change between branches
Sometimes you make a change on the wrong branch. You can move it to the right branch with git stash. From the branch where you made the changes:
`git stash`
`git checkout branch-you-want-it-on`
`git stash pop`


### Some useful tips and tricks

Modify your github client to pull in all the PRs and work on them
You can set up your github client to make it easy to work with submitted pull requests.

Edit your .git/config and add the two fetch lines shown below under remote “upstream”:
[remote "upstream"]
        url = git@github.com:wevote/WebApp.git
        fetch = +refs/heads/*:refs/remotes/upstream/*
        fetch = +refs/pull/*/head:refs/remotes/upstream/pr/* 

Now, when you fetch upstream, you’ll get references to a bunch of PRs.
check one out with `git checkout upstream/pr/3328` for example  
from detached head mode, create a branch with `git branch BRANCHNAME`
fetch upstream, rebase against master, test things out. 
push to your branch to verify that CI tests are green for these changes.

when everything is green and looks legit: 
`git push upstream BRANCHNAME:master`
Pull in a specific PR for testing

Drop commits from a PR
In the branch where you created the commits you want to drop:
`$ git rebase -i upstream/master`

This opens an editor. Delete the lines you don’t want. Then:
	$ git push -f origin branchname
Pretty colors and branch name in your command line prompt
Add something like this to your .bashrc
source ~/.bash_colors

### Git completion
`source $PATH_TO_GIT_CORE/git-completion.bash`  
`source $PATH_TO_GIT_CORE/git-prompt.sh`

### Prompt
`export
PS1="\[$Green\]\t\[$Red\]:\[$Yellow\]\W\[\033[m\]\[$Blue\]\$(__git_ps1)\[$White\]\$
"`
And create a file .bash_colors.

#### How to get a change from someone’s repository into your repo before it’s pushed to master
Define a remote for their github repo, e.g. 
`git remote add pertrai1 https://github.com/pertrai1/WebApp.git`

Now fetch their changes and rebase on top of the branch they have that change in:
`git fetch pertrai1`
`git rebase pertrai1/pertrai1_branchname`

If there are collisions, these files are removed from your git commit. Hunt them down by searching for seven > characters ‘>>>>>>>’ in your project. Resolve any conflicts in your editor. git status will also show the affected files (in red, since they’re not part of a commit)

Add the files back into tracking with `git add .`

Carry on with the rebase: `git rebase --continue`

#### How to get rid of garbage files that shouldn’t be in git

Sometimes my Mac makes .DS_Store files in my git directories and I want to get rid of them:

`$ git status` - check that you don’t have anything important that should be added first!
`$ git clean . -f`

Caution -- if you have any new files that aren’t under git control, this will remove all of them.

