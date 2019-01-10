# Preparing the Environment on Your Machine
[Go back to Readme Home](../../README.md)

## Explanation

In this section we are going to install or update three package managers -- software that downloads libraries and/or executable programs that we rely on to build
the WebApp (npm, Homebrew, and pip).  We are also going install or update two language interpreters (Node and Python):
* [Node](https://nodejs.org/en/): "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."  Node allows you to run JavaScript outside of a browser, 
at the command line, or on a server.  Many of our build processes run on Node.
* [npm](https://www.npmjs.com/): NPM is the Node package manager (installer of software modules), and is automatically installed with Node.  It can be updated separately and occasionally 
this might be necessary.  NPM is used extensively in WebApp to update most of the opensource JavaScript libraries that we leverage.
* [Python](https://www.python.org/): Python is a popular interpreted language that is used most often as a server side language for handling APIs or simple web applications.  The [WeVoteServer](https://github.com/wevote/WeVoteServer), our API server, is written in Python.
* [Homebrew](https://brew.sh/): Homebrew, or simply `brew` at the command line, is "the missing package manager for MacOS."  It is the package manager that is often the
first one installed, and can be used to install other package managers and libraries.
* [pip](https://pip.pypa.io/en/stable/installing/): "pip is [Python's] preferred installer program. Starting with Python 3.4, it is included by default with the Python binary installers." 
The Mac's built-in Python distibution does not include pip, so we need to install it manually.
* [nodeenv](https://github.com/ekalinin/nodeenv): "nodeenv (Node.js virtual environment) is a tool to create isolated Node.js environments.
It creates an environment that has its own installation directories, that doesn't share libraries with other Node.js virtual environments."
* [node-sass](https://github.com/sass/node-sass): "Node-sass is a library that provides binding for Node.js to LibSass, the C version of the popular stylesheet preprocessor, Sass."  We write styles in Sass (scss files), and the node-sass pre-processor compiles them to css on the fly, before the excution of the WebApp begins.
* [Ruby](https://www.ruby-lang.org/en/): "A dynamic, open source programming language with a focus on simplicity and productivity."  Ruby is yet another interpreted language, that comes pre-installed on the Mac.  We use it to install Homebrew.

## Install nodeenv ("Node Env") - Macintosh (see below for Windows)

Install [Homebrew](https://brew.sh/), and then install Python:

    $ cd ~
    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    $ brew install python

<!-- This failed on 3 Macs in a row for me, including a new out of the box Mac, let's skip the easy_install option, Steve April 2018 
</* First try to install PIP (a Python based package installer) with easy_install:

    $ cd ~
    $ curl https://bootstrap.pypa.io/ez_setup.py -o - | sudo python
    $ sudo easy_install pip
    
**Don't worry if easy_install fails, we can also install pip with Python:** 

**ONLY do the following step if easy_install didn't work,** -->

Next use Python to install pip:

    $ curl https://bootstrap.pypa.io/get-pip.py | sudo python

Now install nodeenv with pip. Install nodeenv globally. (For instructions installing it locally, see: https://github.com/ekalinin/nodeenv):

    $ sudo -H pip install nodeenv
    
If you are already using Node and npm, confirm that your installation is at least at these minimum
versions:

    $ node -v
    v10.12.0

    $ npm -v
    6.4.1
    
If you find that your Mac, does not have Node installed, install it with brew. (If you want to have
a fresh install of Node you can `brew unlink node` first.)  A fresh or initial install of Node,
will automatically install the latest version of npm.

    $ brew install node
    $ node -v
    $ npm -v

Create a place for your WebApp virtual environment to live on your hard drive. We recommend installing it away from the WebApp source code:

    $ mkdir /Users/<YOUR NAME HERE>/NodeEnvironments/
    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/

Now create a new virtual environment in that 'NodeEnvironments' folder. This can take many minutes.

    $ nodeenv WebAppEnv

Now activate this new virtual environment:

    $ cd /Users/<YOUR NAME HERE>/NodeEnvironments/WebAppEnv/
    $ . bin/activate

**Note** that you will need to do the step above every time before you start local development. Once you have activated this virtual Node environment, it will persist in the current Terminal tab even as you navigate to different folders (e.g., the We Vote WebApp folder). You'll see that each line on the Terminal starts with `(WebAppEnv)` while the virtual environment is in effect. You can read more about nodeenv [here](https://github.com/ekalinin/nodeenv).

Just to be safe, rebuild node-sass:

    (WebAppEnv) $ npm rebuild node-sass
    (WebAppEnv) $ /usr/local/bin/node -v
    v9.10.1
    
Export your path to the local environment (append the `/usr/local/bin` path segment to the path that is used when in the WebAppEnv):
    
    (WebAppEnv) $ export PATH="/usr/local/bin:$PATH"

**Mac users are now done with this page,** go on to the next section: [Bringing Code to Your Machine](CLONING_CODE.md)


## Install Node.js - Windows

The following instructions were modified from this [blog post](http://blog.teamtreehouse.com/install-node-js-npm-windows).

1. Download the Windows installer from the Node.js web site (typically the .msi file):

     https://nodejs.org/en/download/
     
2. Run the installer (the .msi file you downloaded in the previous step).

3. Follow the prompts in the Node installer (Accept the license agreement, click the NEXT button a bunch of times and accept the default installation settings).

4. Restart your computer. You won’t be able to run Node.js® until you restart your computer.

5. Test the installation (instructions below).

Make sure you have Node and npm installed by running simple commands to see what version of each is installed and to run a simple test program:

*Test Node:* To see if Node is installed, open the Windows Command Prompt, Powershell or a similar command line tool, and type `node -v`. This should print a version number, so you’ll see something like this v0.10.35.

*Test NPM:* To see if NPM is installed, type `npm -v` in Terminal. This should print NPM’s version number so you’ll see something like this 1.4.28

Create a test file and run it. A simple way to test that Node.js works is to create a JavaScript file. For example, name a file `hello.js`, and just add the code `console.log('Node is installed!');`. To run the code simply open your command line program, navigate to the folder where you saved the file, and type `node hello.js`. This will start Node and run the code in the `hello.js` file. You should see the output `Node is installed!`.


Make sure to run `npm install -g gulp-cli` 

If you are still getting errors with gulp this is a [helpful link](https://stackoverflow.com/questions/24027551/gulp-command-not-found-error-after-installing-gulp)

## Set up your environment

If you are running Windows, we recommend installing [Git Bash](https://git-scm.com/downloads).

Create a place to put all of the code from Github:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

---

Next: [Bringing Code to Your Machine](CLONING_CODE.md)

[Go back to Readme Home](../../README.md)

