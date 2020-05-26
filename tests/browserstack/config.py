#!/usr/bin/env python3
import json
import re
import argparse

parser = argparse.ArgumentParser(description='Generate configuration file')
parser.add_argument('-t', '--type', required=True, type=str, choices=['Android', 'iOS', 'Browser'], help='type of test')
parser.add_argument('-f', '--file', type=str, required=True, help='path to configuration file')
parser.add_argument('-j', '--json', default='devices_to_test.json', type=str, help='path to json file')
parser.add_argument('-w', '--write', action='store_true', help='write to configuration file')
parser.add_argument('-l', '--browserstack.local', action='store_false', help='do not test on localhost')
parser.add_argument('-d', '--browserstack.debug', action='store_false', help='turn debugging off')
parser.add_argument('-c', '--isCordova', action='store_true', help='set isCordovaFromAppStore to true')
parser.add_argument('-s', '--acceptSslCerts', action='store_false', help='do not use https')
parser.add_argument('-m', '--isMobileScreenSize', action='store_true', help='set mobile-screen to true')
parser.add_argument('--waitForTimeout', default=180000, type=int, help='time before connection is times out')
parser.add_argument('--connectionRetryTimeout', default=90000, type=int, help='time before connection is retried')
parser.add_argument('--connectionRetryCount', default=3, type=int, help='number of times connection is retried')
args = vars(parser.parse_args())

# Convert boolean to string
for key, value in args.items():
    if type(value) == bool:
        if value:
            args[key] = 'true'
        else:
            args[key] = 'false'

replace = {}
replace.update(args)

if args['type'] == 'Android':
    replace['real_mobile'] = 'true'
    replace['isAndroid'] = 'true'
    replace['isIOS'] = 'false'
elif args['type'] == 'iOS':
    replace['real_mobile'] = 'true'
    replace['isAndroid'] = 'false'
    replace['isIOS'] = 'true'
else:
    replace['real_mobile'] = 'false'
    replace['isAndroid'] = 'false'
    replace['isIOS'] = 'false'

del replace['type']
del replace['file']
del replace['json']
del replace['write']

with open(args['json'], 'r') as f:
    devices = json.load(f)
    for i in range(0,10):
        # generate default values
        replace['os%d' % i] = ''
        replace['browser_version%d' % i] = ''
        # import from json file
        for key, value in devices[args['type']]['test%d' % i].items():
            if key == 'device':
                #generate name
                replace['name%d' % i] = value.replace(' ', '')
            replace["%s%d" % (key, i)] = value

with open(args['file'], 'r') as config:
    lines = config.readlines()
    config.close()
    if lines:
        with open(args['file'], 'w') as config:
            for line in lines:
                replaced = False
                # create output file with configuration values
                for key, value in replace.items():
                    replacedString, numberOfSubstitutions = re.subn(r'%%%s' % key, str(value), line, count=1)
                    if numberOfSubstitutions == 1: 
                        if args['write']:
                            config.write(replacedString)
                        else:
                            print(replacedString.replace('\n',''))    
                        replaced = True
                        break
                if not replaced:
                    if args['write']: 
                        config.write(line)
                    else:
                        print(replacedString.replace('\n',''))
