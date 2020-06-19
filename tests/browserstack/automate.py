#!/usr/bin/env python
import pyautogui
import subprocess 
from pynput import mouse
from pynput import keyboard 
import os 
import re 
import time
import queue 

identity = re.compile(r'^#(.*?) ', flags=re.MULTILINE)

def goToTextEditor():
  pyautogui.hotkey(modifierKey,'2') # go to vim

def goToBrowser():
  pyautogui.hotkey(modifierKey,'1') # Go to Google Chome

def getCssSelector():
  global isId
  isId = False
  cssSelector = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard
  if identity.search(cssSelector):
    isId = True
    return identity.search(cssSelector).group(1) # return id
  else:
    return cssSelector

def on_escape():
  global escape
  escape = True

def setInput():
  global isInput
  isInput = True

def unsetInput():
  global isInput
  isInput = False

def goBack():
  global back
  back = True

def unsetScroll():
  global scroll
  scroll = False

def on_scroll(x, y, dx, dy):
  global scroll 
  scroll = True
  print(scroll)

modifierKey = 'winleft' # i3 modifier key
pause = 0.5
os.environ['DISPLAY'] = ':0' # Needed for Xorg
isInput = False
scroll = False
back = False
isId = False

while True:
  elementSelector = ''
  textInput = ''

  goToBrowser() # Go to browser

  hotkey = keyboard.GlobalHotKeys({'<ctrl>+i': setInput, '<ctrl>+<shift>+u': unsetInput, '<alt>+<left>': goBack,'<end>': unsetScroll})
  hotkey.start() # Listen for hotkeys
  
  mouseListen = mouse.Listener(on_scroll=on_scroll)
  mouseListen.start() # Listen for scrolls

  print('Starting keyboard listener...')
  with keyboard.Events() as events:
    while True:
      try:
        event = events.get(1.0)
        if event.key == keyboard.Key.ctrl_r:
          break
      except queue.Empty:
        pass
  
  print('Scroll: ' + str(scroll))
  mouseListen.stop() # Stop listener
  hotkey.stop() # Stop listener
  print('Starting css selection')
  elementSelector = getCssSelector() # Get css selector
  print('Finished css selection. Element Selector: ' + elementSelector)
  time.sleep(pause) # Prevent race conditions
  pyautogui.click() # Second click

  print(elementSelector)
  subprocess.Popen(['xclip','-se','c','-d',':0','/dev/null']) # Clear clipboard 

  print(isInput)
  if isInput:
    isInput = False # reset isInput
    with keyboard.Events() as events:
      for event in events:
        if event.key == keyboard.Key.ctrl_r: # Check for alt
          time.sleep(pause) # Prevent race conditions
          pyautogui.hotkey('ctrl','a') # Select all
          time.sleep(pause) # Prevent race conditions
          pyautogui.hotkey('ctrl','c') # Copy to clipboard
          textInput = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard
          break

  goToTextEditor() # Go to text editor
  time.sleep(pause) # Prevent race conditions

  if back:
    pyautogui.write('await browser.back();\n') # Write code
    back = False

  if scroll and isId:
    pyautogui.write('await scrollIntoViewSimple("%s");\n' % elementSelector) # Write code
    scroll = False
  elif scroll and not isId
    pyautogui.write('await scrollIntoViewSelect("%s");\n' % elementSelector) # Write code
    scroll = False

  elif isId and not textInput:
    pyautogui.write('await simpleClick("%s");\n' % elementSelector) # Write code
  elif elementSelector and not textInput:
    pyautogui.write("await selectClick('%s');\n" % elementSelector) # Write code
  elif isId and textInput:
    pyautogui.write('await simpleTextInput("%s", "%s");\n' % (elementSelector, textInput)) # Write code
  elif elementSelector and textInput:
    pyautogui.write('await selectTextInput("%s", "%s");\n' % (elementSelector, textInput)) # Write code
  else:
    break
