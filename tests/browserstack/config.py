#!/usr/bin/env python3
import json
from re import sub, S
import argparse
from os import path
from shutil import copyfile
from subprocess import Popen

parser = argparse.ArgumentParser(description='Generate wdio conf file')
parser.add_argument('-l', '--browserstack.local', action='store_true', 
                    help='Test on localhost')
parser.add_argument('-s', '--script', required=True, type=str, 
                    help='Script to test')
parser.add_argument('-c', '--cookie', default='', type=str, 
                    help='voter_device_id cookie')
parser.add_argument('-b', '--batch', required=True, type=str, 
                    choices=['Android', 'iOS', 'Browser'], 
                    help='test batch to test')
parser.add_argument('-t', '--template', default='wdio.conf.template', type=str, 
                    help='path to template file (.template)')
parser.add_argument('-f', '--file', default='parallel.config.js', type=str, 
                    help='path to js configuration file (.js)')
parser.add_argument('-j', '--json', default='devices_to_test.json', type=str, 
                    help='path to json file')
parser.add_argument('-n', '--number', default=5, type=int, choices=range(1, 6), 
                    help='run first n number of tests')
parser.add_argument('-o', '--offset', default=0, type=int, 
                    help='starting test number')
parser.add_argument('-a', '--app', action='store_true', 
                    help='test mobile app instead of web app')
parser.add_argument('-i', '--interchange', action='store_true', 
                    help='select specific test cases')
parser.add_argument('-w', '--write', action='store_true', 
                    help='write to configuration file')
parser.add_argument('-m', '--isMobileScreenSize', action='store_true', 
                    help='set mobile-screen to true')
parser.add_argument('-d', '--isCordova', action='store_true', 
                    help='set isCordovaFromAppStore to true')
parser.add_argument('-g', '--generate', action='store_true', 
                    help='generate template file')
parser.add_argument('-r', '--run', action='store_true', 
                    help='run wdio configuration file')

args = vars(parser.parse_args())

if args['generate'] and args['number'] != 5:
  with open(args['file']) as f:
    temp = sub("{(?:(?!{).)*os%d.*?]" % args['number'], ']', f.read(), flags=S)
  with open(args['template'], 'w') as f:
    f.write(temp)

elif args['generate']:
  copyfile(args['file'], args['template'])
  if not path.isfile(f'./specs/{args["script"]}MainTest.js'):
    copyfile('./specs/exampleTest.js', f'./specs/{args["script"]}MainTest.js')

conf = {}
conf.update(args)

if args['batch'] == 'Android':
  conf['real_mobile'] = True
  conf['isAndroid'] = True
  conf['isIOS'] = False
  conf['resolution'] = ''
elif args['batch'] == 'iOS':
  conf['real_mobile'] = True
  conf['isAndroid'] = False
  conf['isIOS'] = True
  conf['resolution'] = ''
else:
  conf['real_mobile'] = False
  conf['isAndroid'] = False
  conf['isIOS'] = False
  conf['resolution'] = '1920x1080'

if args['app'] and args['batch'] == 'Android':
  conf['app'] = 'browserStackConfig.BROWSERSTACK_APK_URL'
elif args['app'] and args['batch'] == 'iOS':
  conf['app'] = 'browserStackConfig.BROWSERSTACK_IPA_URL'
else:
  conf['app'] = "''"

del conf['batch'], conf['file'], conf['json'], conf['write'], conf['interchange']

# Load json
with open(args['json']) as f:
  devices = json.load(f)

devices = devices[args['batch']]

if args['interchange']:
  while True:
    print(f'{args["number"]} test case(s) will be run. (Ctrl-C to exit)')
    for key, value in devices.items():
      print(f'{key}: {value}')
    try:
      test1, test2 = input('Enter two tests to swap.').split()
    except KeyboardInterrupt:
      break
    except ValueError:
      print('Example: 2 3')
    if devices[test1] and devices[test2]:
      # swap tests
      devices[test1], devices[test2] = devices[test2], devices[test1]

for i in range(args['number']):
  # generate default values
  conf[f'os{i}'] = ''
  conf[f'browser_version{i}'] = ''
  conf[f'browserstack.appium_version{i}'] = ''
  conf[f'device{i}'] = ''

for i in range(args['offset'], args['offset'] + args['number']):
  # import from json file
  for key, value in devices[str(i)].items():
    conf[f'{key}{i}'] = value
    
if args['write']:
  config = open('wdio.conf.js', 'w')

with open(args['template']) as template:
  for line in template.readlines():
    # create output file with configuration values
    for configOption, value in conf.items():
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
