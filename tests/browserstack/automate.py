#!/usr/bin/env python
import pyautogui
import subprocess 
from pynput import mouse
from pynput import keyboard 
import os 
import re 
import time
import queue 

identity = re.compile(r'^#(.*)', flags=re.MULTILINE)

def goToTextEditor():
  pyautogui.hotkey(modifierKey,'2') # go to vim

def goToBrowser():
  pyautogui.hotkey(modifierKey,'1') # Go to Google Chome

def getCssSelector():
  global isId
  isId = False
  cssSelector = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard
  if identity.search(cssSelector.split()[0]): 
    isId = True
    return identity.search(cssSelector.split()[0]).group(1) # return id
  else:
    return cssSelector

def on_press(key):
  if key == keyboard.Key.ctrl_r:
    return False

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

modifierKey = 'winleft' # i3 modifier key
pause = 0.5
os.environ['DISPLAY'] = ':0' # Needed for Xorg
isInput = False
scroll = False
back = False
isId = False
hotkey = keyboard.GlobalHotKeys({'<ctrl>+i': setInput, '<ctrl>+<shift>+u': unsetInput, '<alt>+<left>': goBack,'<end>': unsetScroll})
hotkey.start() # Listen for hotkeys

while True:
  elementSelector = ''
  textInput = ''

  goToBrowser() # Go to browser
  print('Going to browser')

  print('Starting hotkeys')
  
  mouseListen = mouse.Listener(on_scroll=on_scroll)
  print('Starting mouse listener...')
  mouseListen.start() # Listen for scrolls

  keyboardListen = keyboard.Listener(on_press=on_press)
  print('Starting keyboard listener...')
  keyboardListen.start()

  try:
      keyboardListen.wait()
      print('Waiting...')

  finally:
    print('Stopping mouse listener...')
    mouseListen.stop()
    print('Stopping keyboard listener...')
    keyboardListen.stop()

  elementSelector = getCssSelector() # Get css selector
  print('Finished css selection. Element Selector: ' + elementSelector)
  time.sleep(pause) # Prevent race conditions
  pyautogui.click() # Second click

  subprocess.Popen(['xclip','-se','c','-d',':0','/dev/null']) # Clear clipboard 

  if isInput:
    isInput = False # reset isInput
    with keyboard.Events() as events:
      for event in events:
        if event.key == keyboard.Key.ctrl_r: # Check for ctrl_r
          time.sleep(pause) # Prevent race conditions
          pyautogui.hotkey('ctrl','a') # Select all
          time.sleep(pause) # Prevent race conditions
          pyautogui.hotkey('ctrl','c') # Copy to clipboard
          textInput = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard
          break

  print('Going to text editor')
  goToTextEditor() # Go to text editor
  time.sleep(pause) # Prevent race conditions

  if back:
    pyautogui.write('await browser.back();\n') # Write code
    back = False

  if scroll and isId:
    pyautogui.write('await scrollIntoViewSimple("%s");\n' % elementSelector) # Write code
    scroll = False
  elif scroll and not isId:
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
hotkey.stop() # Stop listener
