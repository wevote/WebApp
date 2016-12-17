# Working with Styles (CSS and SASS)

##What is CSS and SASS?
CSS (Cascading Style Sheets) are used to style HTML elements. We use SASS - a CSS preprocessor - with Bootstrap for our styling. We also use the BEM (Block, Element, Modifier) naming methodology (see the example below, of CSS styling using BEM):

.ballot {  	←- block
  &__heading { 	← element
    font: 100% $font-stack;
  }
}

$font-stack: Helvetica, sans-serif;

##SASS file structure
The scss files (in src/sass) are converted to css as part of the build process and house components that are used for custom styling.

#None of these files should be modified:
- main.scss
- _bootstrap-variables.scss
- bootstrap-custom.scss

The bootstrap.scss is set up for partial bootstrap overrides and further customization. You should create special classes for elements rather than overriding default Bootstrap components (for example, referencing the h1 tag); this file is a work-in-progress.

#This file can be modified
- bootstrap.scss TBC

Be sure when searching for styling not to modify the bootstrap.css file in the build directory (however, this is a useful reference to see how SASS builds a custom CSS page with the various components).

A short guide to using SASS can be found here http://sass-lang.com/guide.




[Go back to Readme Home](../../README.md)
