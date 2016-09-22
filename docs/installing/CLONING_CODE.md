# Bringing Code to Your Machine
[Go back to Readme Home](../../README.md)

## Set up your environment

Make sure you have created a place to put all of the code from Github:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

## Setting up your repository for work

1. Install and configure git on your local machine.

1. Create a fork of wevote/WebApp.git. You can do this from https://github.com/wevote/WebApp with the "Fork" button  
(upper right of screen)

1. Change into the `/Users/<YOUR NAME HERE>/MyProjects/` folder and clone your fork:  
`git clone https://github.com/<YOUR USERNAME HERE>/WebApp.git`  

1. Change into your local WebApp repository folder, and set up a remote for upstream:  
`$ git remote add upstream git@github.com:wevote/WebApp.git`  

1. Create SSH keys (or follow [these instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-windows) for Windows):

    1. Create ssh keys: `ssh-keygen -t rsa -C "youremail@somedomain.com"`  

    1. `ssh-add ~/.ssh/id_rsa` OR `ssh-add ~/.ssh/github_rsa`

    1. `pbcopy < ~/.ssh/id_rsa.pub` OR `pbcopy < ~/.ssh/github_rsa.pub`  

        1. The command "pbcopy" copies the contents of the "~/.ssh/id_rsa.pub" key file so you can paste it.

1. Go your profile in Github. In the left navigation, choose "SSH and GPG keys".  
Click the "New SSH key" button to the right of "SSH keys".  
Paste the contents of the "~/.ssh/id_rsa.pub" key file into the "Key" text area, and give it any Title you would like.  


---

Next: [Running WebApp for the First Time](RUNNING_FIRST_TIME.md)

[Go back to Readme Home](../../README.md)

