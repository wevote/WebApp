<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Coding Standards and Best Practices](#coding-standards-and-best-practices)
  - [Coding Standards](#coding-standards)
  - [If there's no issue, please create one](#if-theres-no-issue-please-create-one)
  - [Let us Know you're working on the issue](#let-us-know-youre-working-on-the-issue)
  - [](#)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Coding Standards and Best Practices

## Coding Standards

Please use descriptive full word variable names.

* In the lifecycle of most projects, fixing bugs and maintaining current features end up taking 50%+ of total engineering time.
* Our goal is to create a code base that is easy to understand, making fixing bugs and maintaining 
current features as painless as possible. We will have many engineers working with this code, 
and we want to be welcoming to engineers who are new to the project.
* Short variable names can often create confusion, where a new engineer needs to spend time 
figuring out what a short variable name actually means. (Ex/ “per” or “p” instead of “person”.) 
For this project please use descriptive full word variable names.
* Fellow engineers should be able to zoom around the code and not get stopped with riddles created by short names.

## Art Asset Naming

1. Asset names should be all lower case (ex/ "lower.png")
 
2. If a name has multiple words, use "-" between words in the name (ex/ "lower-case.png")

3. If sequential, put order word + number at start of name (ex/ "slide1-")

4. For fixed size images, include width and height at the end of the name (ex/ "-200x150"). 
Does not apply to svg files.

5. If an image is still a "first draft", lets add "-draft" to the name + version number (ex/ 
"slide3-connect-list-with-photos-draft1-300x370.png")

6. If adding images that are meant to be used in one limited area of the App, 
please put them in their own folder within "src/img/global".

Examples of good names:

    slide1-ballot-simple.svg

    slide3-connect-list-with-photos-draft1-300x370.png
    
Examples of names we avoid:

    Image1.svg

## If there's no issue in github.com, please create one


## Let us Know you're working on the issue

If you're actively working on an issue, please comment in the issue thread stating that you're working on a fix, or (if you're an official contributor) assign it to yourself.

This way, others will know they shouldn't try to work on a fix at the same time.


## Version numbering

We use [SemVer](http://semver.org/) for version numbers. More info: [Versions: Release Names vs Version Numbers](versions/index.md)

---

Next: [What the Heck is a Pull Request?](PULL_REQUEST_BACKGROUND.md)

[Go back to Readme Home](../../README.md)
