#!/usr/bin/env python3
import json
from re import sub, S
import argparse
from os import path
from shutil import copyfile
from subprocess import Popen

parser = argparse.ArgumentParser(description='Generate wdio configuration file')
parser.add_argument('-l', '--browserstack.local', action='store_true', help='Test on localhost')
parser.add_argument('-s', '--scriptName', required=True, type=str, help='Script to test')
parser.add_argument('-c', '--cookie', default='', type=str, help='voter_device_id cookie')
parser.add_argument('-b', '--batch', required=True, type=str, choices=['Android', 'iOS', 'Browser'], help='test batch to test')
parser.add_argument('-t', '--template', default='wdio.conf.template', type=str, help='path to template file (.template)')
parser.add_argument('-f', '--file', default='parallel.wdio.config.js', type=str, help='path to js configuration file (.js)')
parser.add_argument('-j', '--json', default='devices_to_test.json', type=str, help='path to json file')
parser.add_argument('-n', '--numberOfTests', default=5, type=int, choices=range(1, 6), help='run first n number of tests')
parser.add_argument('-o', '--offset', default=0, type=int, help='starting test number')
parser.add_argument('-a', '--app', action='store_true', help='test mobile app instead of web app')
parser.add_argument('-i', '--interchange', action='store_true', help='select specific test cases')
parser.add_argument('-w', '--write', action='store_true', help='write to configuration file')
parser.add_argument('-m', '--isMobileScreenSize', action='store_true', help='set mobile-screen to true')
parser.add_argument('-d', '--isCordova', action='store_true', help='set isCordovaFromAppStore to true')
parser.add_argument('-g', '--generate', action='store_true', help='generate template file')
parser.add_argument('-r', '--run', action='store_true', help='run wdio configuration file')
args = vars(parser.parse_args())

if args['generate']:
  if not args['numberOfTests'] == 5:
    with open(args['file'], 'r') as f:
      template = sub("{(?:(?!{).)*os%d.*?]" % args['numberOfTests'], ']', f.read(), flags=S)
    with open(args['template'], 'w') as f:
      f.write(template)
  else:
    copyfile(args['file'], args['template'])

  if not path.isfile(f'./specs/{args["scriptName"]}MainTest.js'):
    copyfile('./specs/exampleTest.js', f'./specs/{args["scriptName"]}MainTest.js')

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

# Load json
with open(args['json'], 'r') as f:
  devices = json.load(f)

devices = devices[args['batch']]

if args['interchange']:
  while True:
    print(f'{args["numberOfTests"]} test case(s) will be run.')
    for key, value in devices.items():
      print(f'{key}: {value}')
    try:
      testNumber1, testNumber2 = input('Enter two tests to swap. (ctrl-c to exit): ').split()
    except KeyboardInterrupt:
      break
    except ValueError:
      print('Example: 2 3')
    if devices[testNumber1] and devices[testNumber2]:
      # swap tests
      devices[testNumber1], devices[testNumber2] = devices[testNumber2], devices[testNumber1]

for i in range(args['numberOfTests']):
  # generate default values
  replace[f'os{i}'] = ''
  replace[f'browser_version{i}'] = ''
  replace[f'browserstack.appium_version{i}'] = ''
  replace[f'device{i}'] = ''

for i in range(args['offset'], args['offset'] + args['numberOfTests']):
  # import from json file
  for key, value in devices[str(i)].items():
    replace[f'{key}{i}'] = value
    
if args['write']:
  config = open('wdio.conf.js', 'w')

with open(args['template'], 'r') as template:
  for line in template.readlines():
    # create output file with configuration values
    for configOption, value in replace.items():
      # Replace string 
      if type(value) == bool and value:
        line = sub(f'%{configOption}', 'true', line)
      elif type(value) == bool and not value:
        line = sub(f'%{configOption}', 'false', line)
      elif value == '':
        line = sub(f'%{configOption}', "", line)
      else:
        line = sub(f'%{configOption}', str(value), line)

    # delete empty config options
    if "''" in line:
      line = ''
    # Write to file or print to standard output
    if args['write']:
      config.write(line)
    else:
      print(line, end="")    
        
print()

if args['write']:
  config.close()

if args['run']:
  wdio = Popen(['wdio', 'wdio.conf.js', '-l', 'silent'])
  wdio.wait()
