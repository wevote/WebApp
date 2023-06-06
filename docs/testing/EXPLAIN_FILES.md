# Understanding important files in the WebApp/tests/browserstack_automation directory

## [capabilities](../../tests/browserstack_automation/capabilities)

### browser.json

Capabilities for tests involving the browser app.

### mobile.json

Capabilities for tests involving the mobile app(s). Note that this file only exists when `npm run wdio:setup` is run.

## [config](../../tests/browserstack_automation/config)

### browserstack.config.js

Configuration for test scripts.

### browserstack.config.template.js

Template for creating browserstack.config.js.

### wdio.config.js

Configuration for tests run by WebdriverIO.

## [page_objects](../../tests/browserstack_automation/page_objects)

See the [page object pattern](https://webdriver.io/docs/pageobjects) for details.

## [specs](../../tests/browserstack_automation/specs)

Any tests will be stored in this directory.
