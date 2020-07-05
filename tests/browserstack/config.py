#!/usr/bin/env python3
import json
import re
import argparse

parser = argparse.ArgumentParser(description='Generate configuration file')
command_group = parser.add_mutually_exclusive_group() 
# Can not set browser.geoLocation and browser.local simultaneously 
command_group.add_argument('-g', '--browserstack.geoLocation', default='US', type=str, help='Set browser geolocation')
command_group.add_argument('-l', '--browserstack.local', action='store_true', help='Test on localhost')
parser.add_argument('-s', '--scriptName', required=True, type=str, help='Script to test')
parser.add_argument('-b', '--batch', required=True, type=str, choices=['Android', 'iOS', 'Browser'], help='test batch to test')
parser.add_argument('-f', '--file', default='wdio.conf.template', type=str, help='path to template configuration file (.template)')
parser.add_argument('-j', '--json', default='devices_to_test.json', type=str, help='path to json file')
parser.add_argument('-n', '--numberOfTests', default=5, type=str, help='run first n number of tests')
parser.add_argument('-a', '--app', action='store_true', help='test mobile app instead of web app')
parser.add_argument('-i', '--interchange', action='store_true', help='select specific test cases')
parser.add_argument('-w', '--write', action='store_true', help='write to configuration file')
parser.add_argument('-c', '--isCordova', action='store_true', help='set isCordovaFromAppStore to true')
parser.add_argument('-t', '--timeout', default=360000, type=int, help='time before test ends')
parser.add_argument('-m', '--isMobileScreenSize', action='store_true', help='set mobile-screen to true')
parser.add_argument('--acceptSslCerts', action='store_false', help='do not use https')
parser.add_argument('--connectionRetryTimeout', default=90000, type=int, help='time before connection is retried')
parser.add_argument('--connectionRetryCount', default=3, type=int, help='number of times connection is retried')
args = vars(parser.parse_args())

replace = {}
replace.update(args)

if args['batch'] == 'Android':
    replace['real_mobile'] = True
    replace['isAndroid'] = True
    replace['isIOS'] = False
elif args['batch'] == 'iOS':
    replace['real_mobile'] = True
    replace['isAndroid'] = False
    replace['isIOS'] = True
else:
    replace['real_mobile'] = False
    replace['isAndroid'] = False
    replace['isIOS'] = False

if args['app'] and args['batch'] == 'Android':
    replace['app'] = 'browserStackConfig.BROWSERSTACK_APK_URL'
elif args['app'] and args['batch'] == 'iOS':
    replace['app'] = 'browserStackConfig.BROWSERSTACK_IPA_URL'
else:
    replace['app'] = "''"

del replace['batch']
del replace['file']
del replace['json']
del replace['write']
del replace['interchange']

with open(args['json'], 'r') as f:
    devices = json.load(f)
    if args['interchange']:
        while True:
            print('First %s test case(s) will be run.' % args['numberOfTests'])
            for key, value in devices[args['batch']].items():
                print("%s: %s" % (key, value))
            try:
                testNumber1, testNumber2 = map(int, input('Enter two tests to swap. (-1 -1 to exit)').split())
            except:
                break
            if testNumber1 != -1 or testNumber2 != -1:
                devices[args['batch']][str(testNumber1)], devices[args['batch']][str(testNumber2)] = devices[args['batch']][str(testNumber2)], devices[args['batch']][str(testNumber1)]
            else: 
                break

if args['numberOfTests'].find('-') != -1:
  start = int(args['numberOfTests'].split('-')[0]) 
  end = int(args['numberOfTests'].split('-')[1])
else:
  start = 0
  end = int(args['numberOfTests'])

for i in range(start, end + 1):
    # import from json file
    for key, value in devices[args['batch']][str(i)].items():
        replace["%s%d" % (key, (i - start))] = value
    i -= start
    # generate default values
    replace['os%d' % i] = ''
    replace['browser_version%d' % i] = ''
    # Fix appium version (when iOS version < 12 1.17.0 is not supported)
    if float(replace['os_version%d' % i]) < 12 and replace['browserstack.appium_version%d' % i] == '1.17.0' and replace['browserName%d' % i] != 'Android':
      replace['browserstack.appium_version%d' % i] = '1.16.0'

# Read template file
lines = []
with open(args['file'], 'r') as config:
    lines += config.readlines()

# Replace .template file extension with .js
configFileName = args['file'].replace('.template', '.js')

if args['write']:
  config = open(configFileName, 'w')

for line in lines:
    replaced = False
    replacedString = line
    # create output file with configuration values
    for configOption, value in replace.items():
        # Replace string 
        if type(value) == bool and value:
            replacedString, numberOfSubstitutions = re.subn(r'%%%s' % configOption, 'true', replacedString, count=1)
        elif type(value) == bool and not value:
            replacedString, numberOfSubstitutions = re.subn(r'%%%s' % configOption, 'false', replacedString, count=1)
        elif value == '':
            replacedString, numberOfSubstitutions = re.subn(r'%%%s' % configOption, "''", replacedString, count=1)
        else:
          replacedString, numberOfSubstitutions = re.subn(r'%%%s' % configOption, str(value), replacedString, count=1)

    # Write to file or print to standard output
    if args['write']:
        config.write(replacedString)
    else:
        print(replacedString.replace('\n',''))    
