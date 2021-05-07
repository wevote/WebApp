<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Working with WebApp Day-to-Day](#working-with-webapp-day-to-day)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Working with WebApp Day-to-Day

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

Webpack will open a tab in your browser, displaying the WebApp at:

    http://localhost:3000
    
The first start up of Webpack takes a bit of time (30 to 120 seconds), but subsequent compiles only take a few seconds, and are immediately 
re-rendered in the WebApp instance in the new tab

# Working with https for Twitter Signin

    npm run start-https
    
Webpack will open a tab in your browser, displaying the WebApp at:
    
    https://localhost:3000

# Building a bundle.js for Cordova or our Production webservers

    npm run prod 

If you look at the start-https command in the package.json file, you can see that it requires your ssl certificates
to be in `src/cert/server.crt` and your ssl key to be in `src/cert/server.key`
    
As of July 31, 2019, this bundle works with Cordova, but hasn't been tested on production servers.    

# How to Update to Latest Changes from “develop” Branch

The process of stashing code and unstashing code (including dealing with merge conflicts) is much easier if you use an IDE (Integrated Development Environment) like <a href="https://www.jetbrains.com/pycharm/download/">PyCharm Community Edition</a>. This is how you can do it from the command line.

Ctrl-C to stop npm from running. Then:

`(WebAppEnv) $ git stash save "my_branch_20170101"`  # Set aside your current work locally

`(WebAppEnv) $ git branch -a`  # See what branch you are currently set to (look for "*" on left of listing)

`(WebAppEnv) $ git checkout develop`  # If you aren’t set to the develop branch, switch to that

`(WebAppEnv) $ git pull upstream develop`  # Tell your personal fork on your local machine to get the latest from wevote/WebApp

`(WebAppEnv) $ git push origin develop`  # Push this latest version of develop up to your Personal Fork on the github servers

`(WebAppEnv) $ git checkout -b <your-feature-branch>`  # Create a new branch with the name you want to use for your pull request

`(WebAppEnv) $ git stash list`  # Remind yourself the stash name you used

`(WebAppEnv) $ git stash apply stash^{/my_branch_20170101}`  # Apply your stashed code on top of the latest develop branch

Restart web application

    (WebAppEnv) $ npm install
    (WebAppEnv) $ npm start

We have created <a href="https://docs.google.com/drawings/d/1ED4X3Gpy_UruGDSiO8FjjxQeGOmQqIApguodHDo6-ok/edit">this diagram</a> to show the typical flow when preparing a pull request.

# Eliminating the deprecated `componentWillMount() and the not-advised componentWillReceiveProps() 

1) [componentWillMount()](https://reactjs.org/docs/react-component.html) has been deprecated, and will be eliminated, please don't add more of them.  Also
see [React Unsafe Component Lifecycles](https://fb.me/react-unsafe-component-lifecycles) for instructions about how to
replace componentWillMount().
[shouldComponentUpdate()](https://reactjs.org/docs/react-component.html) is invoked before rendering when new props or state are being received. Defaults to true. 

   This method is not called for the initial render or when forceUpdate() is used.

   This method only exists as a performance optimization. Do not rely on it to “prevent” a rendering, as this can lead to bugs. Consider using the built-in PureComponent instead of writing shouldComponentUpdate() by hand. PureComponent performs a shallow comparison of props and state, and reduces the chance that you’ll skip a necessary update"

2) "...**In the future React may treat shouldComponentUpdate() as a hint** rather than a strict directive, and returning false may still result in a re-rendering of the component."

3) Don't unconditionally copy props to state, it is inefficent and causes subtle bugs, see [Anti-pattern: Unconditionally copying props to state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#anti-pattern-unconditionally-copying-props-to-state).

4) See [You Probably Don't Need Derived State](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) in the React.js Blog




---

Next: [Debugging Tools and Tips](DEBUGGING_TOOLS.md)

[Go back to Readme Home](../../README.md)
