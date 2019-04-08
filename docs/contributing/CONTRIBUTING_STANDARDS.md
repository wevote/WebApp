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
figuring out what a short variable name actually means. (Ex/ Please use “person” instead of “per” or “p”.) 
For this project please use descriptive full word variable names.
* Fellow engineers should be able to zoom around the code and not get stopped with riddles created by short names.

## Variable Naming Standards

* Please use full words instead of abbreviations (Ex/ Please use “Person” instead of “per” or “p”.)
* Please use lower case camel case ("camelCaseLettering")
* Please be aware that many variables are coming from our API server lower case separated by an underscore. 
(e.g., "google_civic_election_id"), 


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


# Code Style and eslint

There is no perfect code style.  If you have worked at a few different companies or on a few different open source projects, you
will have used a few different styles.

As of December 2018, the We Vote WebApp src directory contained 1073 files, that have been created and edited by dozens of volunteer
software engineers.  And we had dozens of different code styles in different files.

Inconsistently formatted code is less reliable code, so we decided to (mostly) put aside the 
issue of "what is the best code style", and to adopt the (very widely adopted) styles
that Airbnb came up with for React and JavaScript.  Airbnb's styles have been source controlled 
as an NPM project containing eslint configuration rules for Javascript, and a few related projects for React, and those
rules have been incorporated in our WebApp.

If you use a IDE like [WebStorm](https://www.jetbrains.com/webstorm/), (sadly WebStorm is not free), all the lint [warnings will show up in amber, and lint
errors will show up in red.](https://www.themarketingtechnologist.co/eslint-with-airbnb-javascript-style-guide-in-webstorm/)  Errors will block a git commit and must be fixed.  If there is just
no reasonable way to fix the lint error, or fixing the code is too risky for some reason, it is ok
to suppress the error on the line where it occurs by adding a comment like this...

```const element = findDOMNode(   // eslint-disable-line react/no-find-dom-node```

If your editor does not show lint warnings, running `npm test` from the command line will provide a list of the lint output.
The list might be quite long, so you may want to redirect it into a file that you can edit `npm test > testOutput.txt`

# Code Craftsmanship

We value Software Craftsmanship for the We Vote project since it makes working on the We Vote code base …
* Fun since the product is composed of clean self documenting components that 
  * Do not repeat themselves -- each functional block has a component, or collection of components that can be widely used, or is completely unique.
  * Are easy to rearrange on panels and pages, with less (or no) modifying of the components themselves for new uses or new UI approaches..
* Satisfying since changes have fewer unintentioned effects
* Easier to work on since, the architectural layout is clear, with properly named components and variables, and just enough comments to explain the area that are hard to understand.
* Reliable, since well defined components are partially self tested by being used in many different ways for many purposes.



# Code Quality Guidelines:
* Do no harm:  Stuff happens, but if you are not sure, ask before you commit.
* Software Craftsmenship: Leave every file they touch in better shape than they found it. 
* In React JSX files: commit files that (as much as possible) comply with the “airbnb” preset for jslint (with our few modifications). If you understand the warnings in the files you work on, make small changes to clear the warnings in the areas you are modifying.
* In /WebApp/src/sass files: [BEM Naming Conventions](../working/STYLING.md) should be followed -- BEM Naming makes it straightforward to organize where to group styles together in an object-oriented fashion. (Ex/ We can use a style named `ballot__header__title` and find where it is defined.)
* In Python: Clear all PEP8 warnings before committing.
* Do not copy classes and make small changes, instead examine existing classes and components to see how they modified for the new use case and then reused.  If you absolutely have to copy, be sure to remove, or temporarily comment out, code that is not immediately in use.  
* Commented out code should be rare and should include the date of commenting, and why it remains in place.
* After you have some experience, carefully perform incremental refactoring to break apart monolithic components into smaller reusable components.
* After you have some experience, carefully perform incremental refactoring to rename classes, components and variables to match their current use.
* Delete code that you made redundant.  Cautiously comment out, or delete code that has not been in use for months. If unsure, add a comment with a proposed deletion date, a few months in the future.
* If while searching globally for a phrase, you find multiple matches, this might be a indication that a refactor is needed.
* In code reviews:
   * Do not allow new slightly duplicated code into our codebase (unless there is a good reason for it).
   * If variable or class names are will be meaningless to others, flag them.
   * Overly complex code should be commented or simplified.
   * Flag code style changes or variable conventions, that are unlike the rest of our code.
* Be on the lookout for abandoned, or duplicative styles.  Clean them out when you find them.  Before creating new styles, first look for styles that make sense to reuse.
* Simple is better than clever code, but if clever really helps, add a note to help out the next engineer to look at the code.
* Most React classes should be less than 300 lines long, at 500 lines consider breaking the class up into sub-components.  If the the component’s render method contains multiple static blocks of React components and markup, consider moving them into a new React component.
* Ask before including new open source NPM projects.  Our strong preference is to include projects that NPM rates as high in popularity, quality and maintenance. Avoid projects that haven’t been updated in months or years, as they can pose security risks.
* If you need to fix the open source projects we rely on, please make a pull request against that project.


# If there's no issue in github.com, please create one

## Let us Know you're working on the issue

If you're actively working on an issue, please comment in the issue thread stating that you're working on a fix, or (if you're an official contributor) assign it to yourself. You can also keep the team updated on the work you are doing by attending a team stand-up held on the Daily Hangouts, or post a note in the #agile-stand-up Slack channel. This way, others will know they shouldn't try to work on a fix at the same time.


# Version numbering

We use [SemVer](http://semver.org/) for version numbers. More info: [Versions: Release Names vs Version Numbers](versions/index.md)

---

Next: [What the Heck is a Pull Request?](PULL_REQUEST_BACKGROUND.md)

[Go back to Readme Home](../../README.md)
