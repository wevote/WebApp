#!/usr/bin/env python3
import json
import argparse

parser = argparse.ArgumentParser(description='Removes devices')
parser.add_argument('-f', '--file', type=str, default='devices_to_test.json', help='File name to import json')
parser.add_argument('-t', '--type', type=str, required=True, help='Device type to delete')
parser.add_argument('-n', '--name', type=str, default='', help='Device name to delete')
parser.add_argument('-v', '--version', type=str, default='', help='Device version to delete')
parser.add_argument('-m', '--manual', action='store_true', help='Delete device manually')
args = parser.parse_args()

with open(args.file, 'r') as f:
  devices = json.load(f)

if args.manual:
  while True:
      for key, value in devices[args.type].items():
          print("%s: %s" % (key, value))
      try:
          deleteNumber = input('Enter device number to delete. (-1 to exit): ')
      except:
          break
      if deleteNumber != '-1':
          devices[args.type].pop(deleteNumber)
      else: 
          break
else:
  for number in tuple(devices[args.type]):
    if devices[args.type][number]['os_version'] == args.version:
      devices[args.type].pop(number)
    elif devices[args.type][number]['device'] == args.name:
      devices[args.type].pop(number)
    

i = 0
ordered_devices = {}

for json in devices[args.type].values():
  ordered_devices[str(i)] = json
  i += 1

devices[args.type] = ordered_devices

with open(args.file, 'w') as f:
  f.write(str(devices).replace('\'', '"').replace('}, ','},\n').replace('{"0','\n{"0'))
