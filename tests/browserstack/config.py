#!/usr/bin/env python3
import json
import re
import argparse

def template(filename):
    if not filename.endswith('.template'):
        raise argparse.ArgumentTypeError('Must be a .template file')
    return filename

parser = argparse.ArgumentParser(description='Generate configuration file')
parser.add_argument('-g', '--group', required=True, type=str, choices=['Android', 'iOS', 'Browser'], help='test group to test')
parser.add_argument('-f', '--file', type=template, required=True, help='path to template configuration file (.template)')
parser.add_argument('-j', '--json', default='devices_to_test.json', type=str, help='path to json file')
parser.add_argument('-n', '--numberOfTests', default=10, choices=range(1, 11), type=int, help='run first n number of tests')
parser.add_argument('-i', '--interchange', action='store_true', help='select specific test cases')
parser.add_argument('-w', '--write', action='store_true', help='write to configuration file')
parser.add_argument('-l', '--browserstack.local', action='store_false', help='do not test on localhost')
parser.add_argument('-d', '--browserstack.debug', action='store_false', help='turn debugging off')
parser.add_argument('-c', '--isCordova', action='store_true', help='set isCordovaFromAppStore to true')
parser.add_argument('-s', '--acceptSslCerts', action='store_false', help='do not use https')
parser.add_argument('-t', '--timeout', default=180000, type=int, help='time before test ends')
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

if args['group'] == 'Android':
    replace['real_mobile'] = 'true'
    replace['app'] = 'browserStackConfig.BROWSERSTACK_APK_URL'
    replace['isAndroid'] = 'true'
    replace['isIOS'] = 'false'
elif args['group'] == 'iOS':
    replace['real_mobile'] = 'true'
    replace['app'] = 'browserStackConfig.BROWSERSTACK_IPA_URL'
    replace['isAndroid'] = 'false'
    replace['isIOS'] = 'true'
else:
    replace['real_mobile'] = 'false'
    replace['app'] = ''
    replace['isAndroid'] = 'false'
    replace['isIOS'] = 'false'

del replace['group']
del replace['file']
del replace['json']
del replace['write']
del replace['interchange']

with open(args['json'], 'r') as f:
    devices = json.load(f)
    if args['interchange'] == 'true':
        while True:
            print('First %d test case(s) will be run.' % args['numberOfTests'])
            for key, value in devices[args['group']].items():
                print("%s: %s" % (key, value))
            try:
                testNumber1, testNumber2 = map(int, input('Enter two tests to swap. (-1 -1 to exit)').split())
            except:
                break
            if testNumber1 != -1 or testNumber2 != -1:
                devices[args['group']][str(testNumber1)], devices[args['group']][str(testNumber2)] = devices[args['group']][str(testNumber2)], devices[args['group']][str(testNumber1)]
            else: 
                break
          
    for i in range(0, args['numberOfTests']):
        # generate default values
        replace['os%d' % i] = ''
        replace['browser_version%d' % i] = ''
        # import from json file
        for key, value in devices[args['group']][str(i)].items():
            if key == 'device' or key == 'os':
                #generate name
              replace['name%d' % i] = value.replace(' ', '')
            elif key == 'browserName':
                #generate name
                replace['name%d' % i] += value
            elif key == 'browser_version':
                #generate name
                replace['name%d' % i] += value
            replace["%s%d" % (key, i)] = value

with open(args['file'], 'r') as config:
    lines = config.readlines()
    config.close()
    if lines:
        # Replace .template file extension with .js
        configFilename = args['file'].replace('.template', '.js')
        if args['write'] == 'true':
          filePermissions = 'w'
        else:
          filePermissions = 'r'
        with open(configFilename, filePermissions) as config:
            for line in lines:
                replaced = False
                # create output file with configuration values
                for key, value in replace.items():
                    if args['group'] == 'Browser':
                        if 'device' in line or 'app' in line:
                            replaced = True
                            break 
                    replacedString, numberOfSubstitutions = re.subn(r'%%%s' % key, str(value), line, count=1)
                    if numberOfSubstitutions == 1: 
                        if args['write'] == 'true':
                            config.write(replacedString)
                        else:
                            if args['write'] == 'true':
                                config.write(line)
                            if args['write'] == 'false':
                                print(replacedString.replace('\n',''))    
                        replaced = True
                        break
                if not replaced:
                    if args['write'] == 'true':
                        config.write(line)
                    if args['write'] == 'false':
                        print(replacedString.replace('\n',''))
