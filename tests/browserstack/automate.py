#!/usr/bin/env python
import pyautogui
import subprocess
from pynput import mouse
import os
import re
import time

os.environ['DISPLAY'] = ':0' # Needed for Xorg

def getElementId():
  time.sleep(1) # Prevent race condition
  pyautogui.press('enter') # Focus on attribute
  attributes = []
  while True:
    pyautogui.hotkey('ctrl','a') # Highlight all
    pyautogui.hotkey('ctrl','c') # Copy attribute
    attribute = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard 
    if re.search('^id=', attribute): # Check for id
      return attribute[4:-1] 
    else:
      if attributes.count(attribute) == 0:
        attributes.append(attribute)
        pyautogui.press('tab') # Focus on next attribute
      else:
        return None 

#breakpoint()
with mouse.Events() as events: # Capture mouse events
  while True:
    noClick = True
    pyautogui.hotkey('alt','1') # Go to Google Chrome
    time.sleep(1) # Prevent race conditions
    pyautogui.hotkey('ctrl','shift','c') # Inspect element
    while noClick:
      event = events.get() # Block and wait for event
      if type(event) == mouse.Events.Click and event.pressed and event.button == mouse.Button.left: # Left click
        elementId = getElementId()
        noClick = False
    pyautogui.click(); # Second click
    while type(event) == mouse.Events.Move:
      event = events.get() # Trash all mouse movements
    while type(event) == mouse.Events.Click:
      event = events.get() # Trash all clicks
    while type(event) == mouse.Events.Move:
      event = events.get() # Trash all mouse movements
    while type(event) == mouse.Events.Click:
      event = events.get() # Trash all clicks
    pyautogui.hotkey('alt','2') # Go to vim

    if elementId:
      pyautogui.write('await simpleClick("%s");\n' % elementId) # Write code
  #  else if selectClick:
  #    pyautogui.write('await simpleClick("%s");\n' % elementSelector)
  #  else if elementId && canInputText:
  #    pyautogui.write('await simpleTextInput("%s", "%s");\n' % (elementId, textInput)) # Write code
  #  else if automateMouse.scroll:
  #    pyautogui.write('await scrollIntoViewSimple("%s");\n' % elementId) # Write code
  #  else if selectTextInput:
  #    pyautogui.write('await selectTextInput("%s", "%s");\n' % (elementSelector, textInput)) # Write code
  #  else if back:
  #    pyautogui.write('await browser.back();') # Write code
