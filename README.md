# README for WebApp Installation

## Install nodeenv ("Node Env")

Install nodeenv globally. For instructions installing it locally, see: https://github.com/ekalinin/nodeenv

    $ cd ~
    $ sudo pip install nodeenv

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


## Clone https://github.com/wevote/WebApp

Create a place to put all of the code from Github:

    $ mkdir /Users/<YOUR NAME HERE>/MyProjects/

Retrieve “WebApp” into that folder, so your code ends up here:

    /Users/<YOUR NAME HERE>/MyProjects/WebApp


## Install and start web application

    (WebAppEnv) $ cd /Users/<YOUR NAME HERE>/MyProjects/WebApp
    (WebAppEnv) $ npm install
    (WebAppEnv) $ npm start
    
You should be able to visit WebApp here:

    http://localhost:3001
