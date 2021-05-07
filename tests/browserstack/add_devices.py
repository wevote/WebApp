#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as expect
from selenium.webdriver.common.by import By
import selenium
import json
import pyperclip
import os
import time
import argparse

parser = argparse.ArgumentParser(description='Add devices')
parser.add_argument('-t','--type', type=str, choices=['iOS', 'Android', 'Browser'], required=True, help='device type')
args = parser.parse_args()

def jsonToDict():
  time.sleep(1.2)
  driver.find_element_by_id('copy-code-button').click() # Click Copy to Clipboard
  jsonData = dict(item.split(' :') for item in pyperclip.paste().replace('\n','').replace('"','')[20:-1].split(','))

  # Eliminate whitespace 
  for capability, value in jsonData.items():
    jsonData[capability] = value.strip()

  pyperclip.copy('')
  return jsonData

# Constants
automate_capabilities_url = 'https://www.browserstack.com/automate/capabilities'
device_file = 'devices_to_test.json'
device_types = ['iOS', 'Android', 'Browser']
maxY = 650
appiumVersion = '1.17.0'
capabilities = ['os_version', 'os', 'device', 'browserName', 'browserstack.appium_version', 'browser_version']

# Set up
driver = webdriver.Firefox(service_log_path=os.devnull)

driver.implicitly_wait(15)
wait = WebDriverWait(driver, 20)

driver.get(automate_capabilities_url) # Go to website
driver.find_element_by_id('accept-cookie-notification').click() # Accept cookies
driver.find_element_by_link_text('Java').click() # Click Java
driver.find_element_by_css_selector('li.active-result:nth-child(2)').click()  # Click NodeJS
driver.execute_script("window.scrollTo(0, %d)" % maxY) # Scroll down
driver.find_element_by_id('doc-device-trigger').click() # Click device dropdown
driver.find_element_by_css_selector('div.doc-device:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li > a').click() # Choose iPhone

wait.until(expect.element_to_be_clickable((By.ID, 'browserstack_appium_version_list_chosen')))
driver.find_element_by_id('browserstack_appium_version_list_chosen').click() # Initial appium version displayed on drop down
wait.until(expect.element_to_be_clickable((By.CSS_SELECTOR, '#browserstack_appium_version_list_chosen li:last-child'))) 
driver.find_element_by_css_selector('#browserstack_appium_version_list_chosen li:last-child').click() # Choose appium version 1.17.0


# Get json from file
f = open('devices_to_test.json', 'r+') 
devices = json.load(f)
f.close()

# Main 
# for device_type in device_types:

numberOfDevices = len(devices[args.type]) # Get number of devices for device type

if args.type == 'Android' or args.type == 'iOS':
  driver.find_element_by_id('doc-os-trigger').click() # Click operating system dropdown 
  driver.find_element_by_link_text(args.type).click() # Choose operating system
  deviceList = driver.find_elements_by_css_selector('div.doc-device > div > ul > li > a') # Get list of all devices

  i = 0
  for device in deviceList:
    driver.find_element_by_id('doc-device-trigger').click() # Click device dropdown
    device.click() # Choose device
    time.sleep(0.5)

    currentAppiumVersion = driver.find_element_by_id('browserstack_appium_version_list_chosen').text
    if currentAppiumVersion != appiumVersion:
      wait.until(expect.element_to_be_clickable((By.ID, 'browserstack_appium_version_list_chosen')))
      driver.find_element_by_id('browserstack_appium_version_list_chosen').click() # Initial appium version displayed on drop down
      wait.until(expect.element_to_be_clickable((By.CSS_SELECTOR, '#browserstack_appium_version_list_chosen li:last-child'))) 
      driver.find_element_by_css_selector('#browserstack_appium_version_list_chosen li:last-child').click() # Choose lastest version 

    jsonData = jsonToDict()

    # Remove duplicates
    duplicate = False
    for data in devices[args.type].values():
      if jsonData['device'] == data['device']:
        duplicate = True
        break

    if duplicate:
      continue

    # Remove extra capabilities
    for capability in tuple(jsonData):
      if capability not in capabilities:
        jsonData.pop(capability)

    jsonData.setdefault('browserstack.appium_version', currentAppiumVersion) 
    
    devices[args.type][str(i + numberOfDevices)] = jsonData # Get device json data
    i += 1 # Increment index

else:
  deviceList = driver.find_elements_by_css_selector('[class^="icon-browser-sprite icon-win"]')  # Get list of all windows devices
  deviceList += driver.find_elements_by_css_selector('[class^="icon-browser-sprite icon-mac"]') # Get list of all mac devices
  for device in deviceList:
    driver.find_element_by_id('doc-os-trigger').click() # Click operating system dropdown 
    device.click() # Choose operating system
    browserList = driver.find_elements_by_css_selector('div.doc-browser > div > ul > li > a') # Get list of all browsers

    i = 0
    for browser in browserList:
      driver.execute_script("window.scrollTo(0, %d)" % maxY) # Scroll down
      driver.find_element_by_id('doc-browser-trigger').click() # Click browser dropdown
      try:
        browser.click() # Choose browser
      except selenium.common.exceptions.ElementClickInterceptedException:
        # Show more browsers
        showMoreList = driver.find_elements_by_class_name('show-more-marker')
        for marker in showMoreList:
          marker.click()

      jsonData = jsonToDict()

      # Remove duplicates
      duplicate = False
      for data in devices[args.type].values():
        if jsonData['os_version'] == data['os_version']:
          duplicate = True
          break

      if duplicate:
        continue

      # Remove extra capabilities
      for capability in tuple(jsonData):
        if capability not in capabilities:
          jsonData.pop(capability)

      jsonData.setdefault('browserstack.appium_version', currentAppiumVersion) 

      devices[args.type][str(i + numberOfDevices)] = jsonData # Update device json data
      i += 1 # Increment index

f = open('devices_to_test.json', 'w+')
f.write(str(devices).replace('\'', '"'))
f.close()
