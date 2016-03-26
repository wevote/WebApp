<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Bringing Code to Your Machine](#bringing-code-to-your-machine)
  - [Setting up your repository for work](#setting-up-your-repository-for-work)
    - [Clone the repo](#clone-the-repo)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Bringing Code to Your Machine

## Setting up your repository for work

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

### Clone the repo

* Click the GitHub fork button to create your own fork
* Clone your fork of the repo to your dev system

```
git clone git@github.com:pertrai1/wevote.git
```


---

Next: [Running WebApp for the First Time](RUNNING_FIRST_TIME.md)

[Go back to Readme Home](../../README.md)

