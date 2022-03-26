March 11, 2022  -- Feel free to delete this file in 6 months
## MUI 4 to 5 update

1) "MUI is using emotion as a styling engine by default. If you want to use styled-components instead"

    [emotion](https://emotion.sh/docs/introduction) looks cool, but we are already using styled-components extensively.  So emotion was not installed
    ```
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npm install @mui/material @mui/styles 
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npm install @mui/lab 
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npm install @mui/icons-material
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npm install styled-components@latest
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npm install @mui/styled-engine @mui/styled-engine-sc
    stevepodell@Steves-MBP-M1-Dec2021 WebAppMar2022Strip % npm install @emotion/react @emotion/styled
    ```

2) There can only be one Theme provider for the mod script, and there were 3.  These can be nested back in after the mod

    See:  https://mui.com/customization/theming/

       Deleted srcDeprecated
       Removed ThemeProvider or MuiThemeProvider in 
       * DonationListForm.jsx
       * ContactsTable.jsx
       * CandidateItemEndorsement
       * VoterPhotoUpload
       Removed MuiThemeProvider 
3) Still compiles cleanly and runs on the /ready page

4) Remove the old @material-ui/*
   `stevepodell@Steves-MBP-M1-Dec2021 WebAppMar2022Strip % npm uninstall @material-ui/core @material-ui/icons @material-ui/lab @material-ui/styles`
5) From App.jsx
   remove:
   ```
   import styled, { ThemeProvider } from 'styled-components';
   <ThemeProvider theme={styledTheme}>
   ```
6) Remove createTheme from
   ```
   CandidateItemEndorsement
   VoterPhotoUpload
   ```
   Note this is widespread in Campaigns -- Skipping for now 3/21/22

7) Ran codemods
    ```
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npx @mui/codemod v5.0.0/preset-safe .
    Executing command: jscodeshift /Users/stevepodell/.npm/_npx/62df030d7e52d1d4/node_modules/@mui/codemod/node_modules/jscodeshift/bin/jscodeshift.js --transform /Users/stevepodell/.npm/_npx/62df030d7e52d1d4/node_modules/@mui/codemod/node/v5.0.0/preset-safe.js --extensions js,ts,jsx,tsx --parser tsx --ignore-pattern **/node_modules/** /Users/stevepodell/WebstormProjects/WebApp
    Processing 672 files...
    Spawning 9 workers...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 22 files to free worker...
    All done.
    Results:
    0 errors
    422 unmodified
    1 skipped
    249 ok
    Time elapsed: 78.798seconds
    stevepodell@Steves-MBP-M1-Dec2021 WebApp %
    ```
8) "default variant has changed from standard in v4 to outlined in v5"
variant-prop codemod **was not** run
9) default underline has changed from "hover" in v4 to "always" in v5
Retaining hover style in existing code
    ```
    stevepodell@Steves-MBP-M1-Dec2021 WebApp % npx @mui/codemod v5.0.0/link-underline-hover .     
    Executing command: jscodeshift /Users/stevepodell/.npm/_npx/62df030d7e52d1d4/node_modules/@mui/codemod/node_modules/jscodeshift/bin/jscodeshift.js --transform /Users/stevepodell/.npm/_npx/62df030d7e52d1d4/node_modules/@mui/codemod/node/v5.0.0/link-underline-hover.js --extensions js,ts,jsx,tsx --parser tsx --ignore-pattern **/node_modules/** /Users/stevepodell/WebstormProjects/WebApp
    Processing 671 files...
    Spawning 9 workers...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 50 files to free worker...
    Sending 21 files to free worker...
    All done.
    Results:
    0 errors
    668 unmodified
    0 skipped
    3 ok
    Time elapsed: 3.580seconds
    stevepodell@Steves-MBP-M1-Dec2021 WebApp %
   ```
10) Add alias wrapper for styled-components in webpack.config.js
     ```
     resolve: {
       modules: [path.resolve(__dirname, source), 'node_modules'],
       extensions: ['*', '.js', '.jsx'],
       alias: {
         '@mui/styled-engine': '@mui/styled-engine-sc',
       },
    },
    ```
11) Change to the styled that works (lost a couple of days to this one!)
    ```
    from:
    import styled from 'styled-components';
    to:
    import styled from '@mui/material/styles/styled';
    DO NOT USE:
    NO NO NO! import { styled } from '@mui/styles';
    ```
12) Minor new syntax requirement for wrapped styled-components (1,480 instances)
    ```
    ^(const.*?)= styled\.(.*?)`
    to
    $1= styled('$2')`
    ```
13) Convert all passed parameters to styled-components    
    ```
    const OuterWrapperHeaderBar = styled('div', {
      shouldForwardProp: (prop) => !['displayHeader'].includes(prop),
    })(({ displayHeader }) => (`
      border-bottom: 1px solid #ddd;
      flex-grow: 1;
      min-height: 36px;
      display: ${displayHeader ? '' : 'none'};
    `));
    ```
14) Change imports for keyframes
    ```
    import { keyframes } from 'styled-components';
    to
    import { keyframes } from '@emotion/react';
    ```
    ```
15) Default breakpoints -- Note: now use system values instead of our previous definitions
    Each breakpoint (a key) matches with a fixed screen width (a value):
    ```
    xs, extra-small: 0px
    sm, small: 600px
    md, medium: 900px
    lg, large: 1200px
    xl, extra-large: 1536px
    These values can be customized.
    ```
16) styled ending with `
    ```
     const CustomizedSlider = styled(Slider)`
     color: #20b2aa;
    
     :hover {
     color: #2e8b57;
     }
    
     & .MuiSlider-thumb {
     border-radius: 1px;
     }
     `;
     ```
17) Style with literal css
     ```
     import * as React from 'react';
     import { styled } from '@mui/material/styles';
     import Button from '@mui/material/Button';
     import Tooltip from '@mui/material/Tooltip';
    
     const StyledTooltip = styled(({ className, ...props }) => (
       <Tooltip {...props} classes={{ popper: className }} />
     ))`
       & .MuiTooltip-tooltip {
         background: navy;
       }
     `;
     ```
18) Raw css in styling
     ```
    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
       color: theme.status.danger,
       '&.Mui-checked': {
          color: theme.status.danger,
       },
     }));
    ```
19) 3/15: Couldn't get styled('div')` to work, needed
    ```
    const OuterWrapper = styled('div')({
      marginBottom: '8px !important',
      width: '100%',
    });
    ```
20) 3/15 works in codesandbox with our mui-theme imported
    ```
    const SteveDiv = styled("div")`
      font-size: 30px;
      padding-right: 4px;
      padding-top: 5px;
      color: ${(props) => props.theme.colors.pinkpink};
    `;

    const SteveDiv2 = styled("div")`
      font-size: 30px;
      padding-right: 4px;
      padding-top: 5px;
      color: ${(props) => props.co};
    `;

    const SteveDiv3 = styled("div", {
      shouldForwardProp: (prop) => !["coDo"].includes(prop)
    })(({ coDo }) => (`
      font-size: 30px;
      padding-right: 4px;
      padding-top: 5px;
      color: ${coDo};
    `));

    export default function StyledWithProps() {
      return (
        <Stack spacing={2} direction="row">
          <Div>Normal</Div>
          <Div primary>Primary!</Div>
          <Div secondary>Secondary!!</Div>
          <SteveDiv>Steve</SteveDiv>
          <SteveDiv2 co={"#5555ff"}>Steve</SteveDiv2>
          <SteveDiv3 coDo={"#5555e0"}>Steve</SteveDiv3>        </Stack>
      );
    }
    ```
21) in Sandbox, our orignal form does not work
    TypeError, _styled.default.div is not a function
    ```
    const SteveDiv3 = styled.div`
      color: #999;
      font-size: 16px;
    `;
    ```
22) Sandbox

    https://codesandbox.io/s/mui-v5-styled-with-custom-props-example-forked-3r10s1?file=/demo.js:1305-1350
23) 
