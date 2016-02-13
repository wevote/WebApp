# Contributing to wevote/WebApp

Thank you for your interest in the We Vote WebApp project. Please let us know if we can help you get started.
 (contact info: https://github.com/wevote)
This README outlines the proper ways to contribute to the project. 
(Feb 13, 2016 Update: This process is still a work-in-progress.)

## Pull Requests

Instead of direct check-ins to this repository, we use pull requests. Here is an outline of this process:

1. Fork the wevote/WebApp repository
  * Go to https://github.com/wevote/WebApp and click the “Fork” button in the upper right corner of the page. You will be asked where you want to fork it to. We suggest that you fork to your personal Github page.
  * See also [https://help.github.com/articles/fork-a-repo/](https://help.github.com/articles/fork-a-repo/)
2. Clone your forked repository to your local machine
  * For detailed instructions, see: [Step 2: Create a local clone of your fork](https://help.github.com/articles/fork-a-repo/)
  * When you create a local clone of your fork, you may need to manually add a sub-folder to the folder where github 
  places projects. Suggestion: name this folder something like “PersonalGitForks”. This is so that the folder named 
  “WebApp” does not conflict with the cloned folder from https://github.com/wevote/WebApp
3. Add the repository you forked as the upstream repository
  * To keep your fork synced with wevote/WebApp, use these the command line commands:
    ```
    cd /Users/<Your Home Directory>/<Your Projects Folder>/PersonalGitForks/WebApp
    git remote add upstream git@github.com:wevote/WebApp.git
    ```
  * Confirm with "git remote -v"
    ```
        $ git remote -v
        origin	https://github.com/DaleMcGrew/WebApp.git (fetch)
        origin	https://github.com/DaleMcGrew/WebApp.git (push)
        upstream	git@github.com:wevote/WebApp.git (fetch)
        upstream	git@github.com:wevote/WebApp.git (push)
    ```
  * For detailed instructions, see: [Step 3: Configure Git to sync your fork](https://help.github.com/articles/fork-a-repo/)
4. To keep your personal fork synchronized with wevote/WebApp
    ```
        git fetch upstream
    ```
  * Once you do this, you can `git remote -a` to see what repositories you have available to you.
  * For detailed instructions, see: [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)
  * If you get an error like "Permission denied (publickey)" see: [Error permission denied public key](https://help.github.com/articles/error-permission-denied-publickey/)
  * http://stackoverflow.com/questions/12940626/github-error-message-permission-denied-publickey
5. You can do a `git checkout -b origin/develop develop` to bring down the develop
branch from your cloned repository.
6. Once you have done so, run `git checkout develop`. It is important to think of
develop branch as your master and not worry about the master branch.

7. Next, sync the develop branch with the upstream branch. `git branch
--set-upstream-to upstream/develop`. Doing this will allow you to pull from the
original repo develop branch and not your own. You won't be committing to your
develop branch, so by doing this you will always be able to pull the latest from
the we vote repository develop branch.
8. To start development, create a branch to work on. Do this by `git checkout -b
name-of-branch`. This will put you into the branch to start to do your
development.
9. Once you have made your changes, you can commit the changes and then push. If
you get a message about setting upstream, do ahead and make the change to
setting the branch upstream to your repository.
10. You will go to your repository and see that there is a message that you have
a branch that you can do a pull request for. Click the button and you will see
where you can add a message to your pull request. One important note is that you
want to make sure the base fork is to the develop branch of wevote/WebApp and
not to master. 
11. Take a look over the changes that you are doing a pull request for. If all
looks ok, go ahead and do the pull request.

If you have more work to do after the pull request, go ahead and create a new
branch and start to work off of that just as you did above. You can always do
a `git checkout develop` to switch back to the develop branch and sync it with
the upstream develop branch simply by doing a `git pull`. No need to worry about
going to the master branch as it will rarely be in sync.

These are the steps to doing a pull request. You can do this from the command
line or inside of your favorite IDE. 
