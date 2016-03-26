<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [We Vote Process for Approving Pull Requests](#we-vote-process-for-approving-pull-requests)
- [Bringing a Pull Request to your Local Machine for Verification](#bringing-a-pull-request-to-your-local-machine-for-verification)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# We Vote Process for Approving Pull Requests
We have a team of engineers who can approve pull requests for WebApp (Nick Fiorini, Rob Simpson, Lisa Cho, Dale McGrew). A few notes about our process:

* Give thumbs up before approving to confirm that you followed this verification process.
* Provide general comments and line comments wherever relevant.
* Try to avoid stopping pull requests if the problems identified are minor, and can be improved through an iteration.
* If the changes are significant and may include breaking changes, the pull-request approver should pull the pull request to their local machine and verify that functionality isn’t broken.

# Bringing a Pull Request to your Local Machine for Verification
Add the contributor's repository as a remote repo. Here are the core contributors:

    git remote add pertrai1 https://github.com/pertrai1/WebApp
    git fetch pertrai1
    git remote add pertrai1 https://github.com/nf071590/WebApp
    git fetch nf071590
    git remote add pertrai1 https://github.com/lisamcho/WebApp
    git fetch lisamcho
    git remote add pertrai1 https://github.com/dalemcgrew/WebApp
    git fetch dalemcgrew
    Find the branch that the person is submitting:
    git branch -a
    
TODO: Figure out how to pull a remote branch to your local

---

For basic tips about using Pull Requests, see [Creating a Pull Request](CREATING_PULL_REQUEST.md)

See also [Pull Request Advanced Tips & Tricks](PULL_REQUEST_ADVANCED.md)

See also [Troubleshooting Pull Request Problems](PULL_REQUEST_TROUBLESHOOTING.md)

[Go back to Readme Home](../../README.md)
