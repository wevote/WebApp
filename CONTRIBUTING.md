# Contributing

This outlines the proper ways to contribute to the project.

## Pull Requests

We do not allow committing straight to the master branch of this repository. We
also have a policy of forking the repo, creating branches from your fork,
pushing your branch, and then requesting a Pull Request.

Here is an outline of doing a pull request:

1. Fork the repository
2. Clone your forked repository to your machine
3. Add the repository you forked as the upstream repository - `git add remote
upstream git@github.com:wevote/WebApp.git`
4. Do a `git fetch upstream`. Once you do this, you can `git remote -a` to see
what repositores you have available to you.
5. You can do a `git checkout -b origin/develop develop` to bring down the develop
branch from your cloned repository.
6. Once you have done so, run `git checkout develop`. It is important to think of
develop branch as your master and not worry about the master branch.
7 Next, sync the develop branch with the upstream branch. `git branch
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
