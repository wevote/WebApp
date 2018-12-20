# Bringing Code to Your Machine
[Go back to Readme Home](../../README.md)

## Set up your environment

Make sure you have created a place to put all of the code from Github, for example:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

## Setting up your repository for work

1. Install and configure git on your local machine if it is not already installed. See instructions [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1. Create a fork of wevote/WebApp.git repository. You can do this from https://github.com/wevote/WebApp with the "Fork" button (upper right of screen)

1. Using your terminal program, change directory into the local folder on your computer where you want the WebApp repository to be downloaded (replacing "<YOUR NAME HERE>" with your login name, and <YOUR GITHUB USERNAME HERE> with your github username) and clone your fork:  
  
    `cd /Users/<YOUR NAME HERE>/MyProjects/`

    `git clone https://github.com/<YOUR GITHUB USERNAME HERE>/WebApp.git`

1. Change into your local WebApp repository folder, and set up a remote for upstream:

    `cd /Users/<YOUR NAME HERE>/MyProjects/WebApp`

    `$ git remote add upstream git@github.com:wevote/WebApp.git`  

1. Create and set up SSH keys. You can follow the steps below and find related documentation [here](). You can also refer to 
[these instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-windows) for Windows.

  1. If you do not already have an SSH key pair you would like to use, create SSH keys: 
   `ssh-keygen -t rsa -C "youremail@somedomain.com"`. The Terminal will provide `/Users/<YOUR NAME>/.ssh/id_rsa` as a default filename, but you can choose another filename if you would like, such as `github_rsa`. If you already have a SSH key pair you would like to use, skip to the next step.

  1. Run `ssh-add ~/.ssh/id_rsa` OR `ssh-add ~/.ssh/github_rsa` (or whatever file name you chose) to add SSH private keys into the SSH authentication agent.

  1. Run `pbcopy < ~/.ssh/id_rsa.pub` (or whatever file name you chose) to copy the contents of the *public* key file so you can paste it in the next step. *Note* that you are copying the file ending in the extension `.pub`.

  1. Go to your "Settings" page in GitHub (click on your avatar on the top right). In the left navigation, choose "SSH and GPG keys".
  
  1. Click the "New SSH key" button on the top right.
  
  1. Paste the contents of the "~/.ssh/id_rsa.pub" key file (which you just copied three steps earlier) into the "Key" text area, and give it any Title you would like.

---

Next: [Running WebApp for the First Time](RUNNING_FIRST_TIME.md)

[Go back to Readme Home](../../README.md)

