# Styling guidelines

Styling is currently handled with [Sass](http://sass-lang.com/guide) which compiles `scss` partials into two site-wide stylesheets (`main.css` and `bootstrap.css`).

*_Eventually, we should look into switching to React inline styles (with something like React CSS Modules)._


### Directory structure
Stylesheet partials are organized by scope (based on the ITCSS model), and compiled with specificity in mind.

1. **Setup** - Variables, Mixins, and Functions
2. **Base** - Global and base styles
3. **Vendor** - Third-party styles
4. **Utility** - Utility and helper (typically single-purpose) classes
5. **Components** - Objects, Components, Sections, and Template styles
6. **Overrides** - Overrides and hacks


### A note on using Bootstrap
This project relies heavily on the Bootstrap framework and related third-party plugins. Bootstrap's core value lies in its solid set of default helpers and styles, but as a third-party framework, it should not be expected to support all styling needs and it should not be customized with overrides (except in rare instances).

Rely on Bootstrap styles and helpers when they can be used without hacks, and create sensible custom (We Vote specific) patterns and helpers instead of trying to extend Bootstrap styles.

To edit Bootstrap defaults, set variable values in `_bootstrap-variables.scss` and only use selector strings to override Bootstrap declarations as a **last resort**.


## Naming Conventions

### Naming prefixes
Use these prefixes for any custom classes. This helps keep classes scoped and identifiable (and more readily distinguishable from unprefixed Bootstrap or other vendor classes).
- `o-` Objects - Patterns like 'media object' that don't have 'decorative' styling
- `u-` Utilities - Largely single-purpose helper classes
- `c-` Components - For reusable components
- `js-` Javascript hooks - Use a unique class when a script needs it for manipulation
- `analytics-` Tracking hooks for analytics (use shorter prefix?)
- `is-` UI states (e.g. `.nav-item.is-selected`, `.dropdown-menu.is-active`) Declarations must be chained or scoped to element or component classes

### BEM Naming Conventions
Components, Objects, and small scoped sections should use the BEM naming convention: (`component__child--modifier`).

Styles that reference React components should use the same Camel Case naming convention. Design patterns that don't refer to a dedicated React component use dashed naming. (`.BallotItem` vs `.twitter-followers`)

**Try to limit creation of (non React)'component' styles to reusable patterns to avoid excessive customizations.**


## Helpers

1. Avoid using raw (numeric) values for style declarations. Always try to use a context-appropriate 'token' or variable instead. (Linter rules are in place to require variables for certain properties.)


### Use Tokens/Variables (avoid raw values)

Tokens refer to variables that specify context. They add additional layers of abstraction (with specificity) to keep usage more scoped and identifiable.

Examples:

- `$space-xs: 4px;`
- `$space-inset-xs: $space-xs;`
- `$font-size-xl: 1.5rem; // (24px)`


### Utility Classes

When styling, try to use the largest, appropriate pattern/component available in each case, and rely on defaults as much as possible. When customization _is_ required, consider using utility classes on the markup to reduce the need for custom stylesheets. These helpers are meant to help maintain consistency when there are no larger design patterns available.

#### Inline
*Inline helpers apply spacing to the right of an element to aid in spacing items in a row or displayed inline.*
ex: `.u-push--xs { margin-right: $space-xs; } // 4px`

#### Stack
*Stack helpers apply vertical spacing beneath elements.*
ex: `.u-stack--md { margin-bottom: $space-md; } // 8px`

#### Inset

*Inset helpers apply even padding within an element. Additional 'squish,' 'stretch,' and 'v(ertical)' variations are also available.*
ex:

- `.u-inset--lg { padding: $space-lg; } // 16px`
- `.u-inset__squish--md { padding: $space-sm $space-md; } // 8px 16px`
- `.u-inset__stretch--sm { padding: $space-sm $space-xs; } // 8px 4px`
- `.u-inset__v--sm { padding-top: $space-sm; padding-bottom: $space-sm; } // 8px 0`

# To Do:
- [ ] Add typographic + heading utility classes
- [ ] Clean up colors (remove old and add new)
- [ ] Replace length literals with variables/tokens
- [ ] Add Sass linter
