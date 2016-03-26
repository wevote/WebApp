<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Troubleshooting Pull Request Problems](#troubleshooting-pull-request-problems)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Troubleshooting Pull Request Problems

Note: if there’s a conflicting commit in the history of your master branch, you
can destroy your branch and replace it with a fresh copy using the command  

`git checkout -B master upstream/master`.  

To make sure your commit goes in at the top of everything else on the upstream
repo, rebase: 

`git rebase upstream/master`  

If there are conflicts, open the file and look for the diff markers, resolve, and continue.

---

For basic tips about using Pull Requests, see [Creating a Pull Request](CREATING_PULL_REQUEST.md)

See also [Pull Request Advanced Tips & Tricks](PULL_REQUEST_ADVANCED.md)

See also [Approving Pull Requests](APPROVING_PULL_REQUESTS.md)

[Go back to Readme Home](../../README.md)
