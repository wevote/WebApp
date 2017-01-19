# Preparing the Environment on Your Machine
[Go back to Readme Home](../../README.md)

## Install nodeenv ("Node Env") - Macintosh (see below for Windows)

Install nodeenv globally. For instructions installing it locally, see: https://github.com/ekalinin/nodeenv

    $ cd ~
    $ curl https://bootstrap.pypa.io/ez_setup.py -o - | sudo python
    $ sudo easy_install pip
    $ sudo -H pip install nodeenv
    
Tip: If `sudo easy_install pip` fails, you can try:

    $ brew install python

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
    
IF you find that your node or npm versions are below that, run this command:

    (WebAppEnv) $ sudo npm install -g npm
    (WebAppEnv) $ npm rebuild node-sass
    (WebAppEnv) $ brew unlink node
    (WebAppEnv) $ brew install node

## Install node.js - Windows

The following instructions were modified from this [blog post](http://blog.teamtreehouse.com/install-node-js-npm-windows).

1. Download the Windows installer from the Nodes.js web site (typically the .msi file):

     https://nodejs.org/en/download/
     
2. Run the installer (the .msi file you downloaded in the previous step.)

3. Follow the prompts in the Node installer (Accept the license agreement, click the NEXT button a bunch of times and accept the default installation settings).

4. Restart your computer. You won’t be able to run Node.js® until you restart your computer.

5. Test

Make sure you have Node and NPM installed by running simple commands to see what version of each is installed and to run a simple test program:

Test Node. To see if Node is installed, open the Windows Command Prompt, Powershell or a similar command line tool, and type node -v. This should print a version number, so you’ll see something like this v0.10.35.

Test NPM. To see if NPM is installed, type npm -v in Terminal. This should print NPM’s version number so you’ll see something like this 1.4.28

Create a test file and run it. A simple way to test that node.js works is to create a JavaScript file: name it hello.js, and just add the code console.log('Node is installed!');. To run the code simply open your command line program, navigate to the folder where you save the file and type node hello.js. This will start Node and run the code in the hello.js file. You should see the output Node is installed!.

## Set up your environment

If you are running Windows, we recommend installing [Git Bash](https://git-scm.com/downloads)

Create a place to put all of the code from Github:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

---

Next: [Bringing Code to Your Machine](CLONING_CODE.md)

[Go back to Readme Home](../../README.md)

