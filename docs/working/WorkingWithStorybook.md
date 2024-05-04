# [Storybook](https://storybook.js.org)

Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation ...

We started using Storybook in 2024.

### Our source files
Our Storybook source-controlled code is located in `WebApp/src/js/common/stories`

### Compiling Our Source Files

`npm run build-storybook`

Compiles the files into the directory `/WebApp/storybook-static`

### Accessing the compiled files on Quality

On our production servers, running the command `npm run build` (or `npm run prod`) compiles the
Storybook files and copies them to `WebApp/build/storybook-static`

Once deployed on "quality", those files can be accessed at [https://quality.wevote.us/storybook-static/index.html](https://quality.wevote.us/storybook-static/index.html)

### Accessing the not-compiled source files on your Mac

Running `npm run storybook` (or `storybook dev -p 6006`) in a terminal opens up a
http session in your browser at `http://localhost:6006/?path=/docs/configure-your-project--docs`


