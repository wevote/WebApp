<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [What the Heck is a Pull Request?](#what-the-heck-is-a-pull-request)
  - [Code staging areas:](#code-staging-areas)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# What the Heck is a Pull Request?

A video series describing pull requests:
https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github

Description of Git branching model:
http://nvie.com/posts/a-successful-git-branching-model/

Collaborating on projects using pull requests: https://help.github.com/categories/collaborating-on-projects-using-pull-requests/

We also created [this handy chart](https://docs.google.com/drawings/d/1ED4X3Gpy_UruGDSiO8FjjxQeGOmQqIApguodHDo6-ok/edit) 
to show the various steps working with pull requests.

## Code staging areas:

1) wevote/WebApp, master branch (github servers): Used for working releases

2) wevote/WebApp, develop branch (github servers): Where the team does its work

3) YOUR_NAME/WebApp, develop branch (github servers): Your Personal Fork

4) YOUR_NAME/WebApp, develop branch (your computer): Your Personal Fork on your computer

5) YOUR_NAME/WebApp, YOUR_BRANCH branch (your computer): A branch on your computer where you are doing work

6) YOUR_NAME/WebApp, YOUR_BRANCH branch (github servers): A branch on github where you park your code when you are getting ready to create pull request (or to back up your code)

7) wevote/WebApp, YOUR_BRANCH branch (github servers): Your branch submitted as a pull request

---

Next: [Before Your First Pull Request](PULL_REQUEST_SETUP.md)

[Go back to Readme Home](../../README.md)
