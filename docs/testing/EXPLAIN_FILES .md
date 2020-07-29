# Understanding important files in the WebApp/tests/browserstack directory

-rw-r--r-- 1 rpite rpite 6122 Jul  5 14:00 add_devices.py</br>
-rw-r--r-- 1 rpite rpite 3929 Jun 20 17:22 automate.py</br>
-rw-r--r-- 1 rpite rpite  476 Jul 27 13:13 browserstack.config.js</br>
-rw-r--r-- 1 rpite rpite  337 May 15 12:33 browserstack.config-template.js</br>
-rw-r--r-- 1 rpite rpite 5358 Jul 29 08:25 config.py</br>
-rw-r--r-- 1 rpite rpite 6603 Jul 15 14:16 devices_to_test.json</br>
-rw-r--r-- 1 rpite rpite  112 Apr 27 05:15 .eslintrc</br>
-rw-r--r-- 1 rpite rpite 4744 Jul 29 08:26 parallel.wdio.config.js</br>
-rw-r--r-- 1 rpite rpite  117 May 21 18:51 README.md</br>
-rw-r--r-- 1 rpite rpite 1551 Jul 13 10:33 remove_devices.py</br>
-rw-r--r-- 1 rpite rpite 1852 Jul 27 13:30 repl</br>
-rw-r--r-- 1 rpite rpite   78 Jul 29 10:42 requirements.txt</br>
drwxr-xr-x 2 rpite rpite 4096 Jul 29 10:25 specs</br>
-rwxr-xr-x 1 rpite rpite 1607 Jul 15 05:52 testScript</br>
-rw-r--r-- 1 rpite rpite 7979 Jul 27 13:29 utils.js</br>
-rw-r--r-- 1 rpite rpite 4169 Jul 29 08:21 wdio.conf.js</br>
-rw-r--r-- 1 rpite rpite 4564 Jul 29 07:55 wdio.conf.template</br>

## Python Scripts

Requires python3+

To install python3 modules do:

      $ pip3 install -r requirements.txt 

### add_devices.py

Adds device json to the devices_to_test.json file. Use -h for help.

### automate.py

Automatically inserts code into test script file. Requires [i3-wm](https://i3wm.org/) and xclip. Use -h for help.

### remove_devices.py

Removes device json from the devices_to_test.json file. Use -h for help.

### config.py

Uses the wdio.config.template file to generate the wdio.config.js file, which is used for running the test. Use -h for help.

## Javascript files

### browserstack.config.js

Configuration file for test scripts.

### parallel.wdio.config.js

Template file for creating wdio.config.template.

### utils.js

Defines javascript functions used in test scripts.

### wdio.conf.js

Configuration for test run by webdriverio.

## Bash scripts

Requires bash

### testScript

Generates the template file named wdio.config.template which acts as a template for creating wdio.config.js as well as creates the script using the script name parameter if it does not already exist.

## Miscellaneous files

### repl

Copied and pasted into the [wdio repl](https://webdriver.io/docs/repl.html) to use the functions defined in utils.js

### wdio.conf.template

Template file for creating wdio.conf.js

