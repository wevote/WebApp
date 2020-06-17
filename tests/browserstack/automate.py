#!/usr/bin/env python
import pyautogui
import subprocess 
from pynput import mouse
from pynput import keyboard 
import os 
import re 
import time
import queue 

def goToTextEditor():
  pyautogui.hotkey(modifierKey,'2') # Go to vim

def goToBrowser():
  pyautogui.hotkey(modifierKey,'1') # Go to Google Chome
  time.sleep(pause) # Prevent race conditions
  pyautogui.hotkey('ctrl','shift','c') # Inspect element

def parseHtml(getId):
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('fn','f2') # Select html
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('ctrl','a') # Highlight all
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('ctrl','c') # Copy html
  pyautogui.press('esc') # Reset

  html = subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Get clipboard 
  elementHtml = re.search(r'(<.*?>)', html).group(1) # Match first element

  if re.search(r'<(.*?) ', elementHtml).group(1) == 'input': # Check if tagname is input
    global isInput
    isInput = True

  if getId:
    if re.search(r' id="(.*?)"', elementHtml):
      return re.search(r' id="(.*?)"', elementHtml).group(1) # Return id
    else:
      return None

  else:
    time.sleep(pause) # Prevent race condition
    pyautogui.click(button='right') # Open menu
    pyautogui.press('down', presses=8) # Go to Copy CSS Selector
    pyautogui.press('enter') # Select Copy CSS Selector
    return subprocess.Popen(['xclip','-s','c','-d',':0','-o'], stdout=subprocess.PIPE).stdout.read().decode() # Return css selector

def on_canonical(function):
  return lambda key : function(listener.canonical(key))

def on_activate():
  global back
  back = True
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('ctrl','shift','i') # Close developer tools
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('alt','left') # Go back
  time.sleep(pause) # Prevent race condition
  pyautogui.hotkey('ctrl','shift','c') # Inspect element

modifierKey = 'winleft' # i3 modifier key
pause = 0.5
os.environ['DISPLAY'] = ':0' # Needed for Xorg
elementId = ''
elementSelector = ''
textInput = ''
back = False
isInput = False
scroll = False
backHotKey = keyboard.HotKey(keyboard.HotKey.parse('<alt>+<left>'), on_activate) # Go to on_activate when alt+left is pressed

with mouse.Events() as mouseEvents:
  while True:
    goToBrowser() # Go to browser

    listener = keyboard.Listener(on_press=on_canonical(backHotKey.press)) 
    listener.start() # Listen for alt+left

    while True:
      mouseEvent = mouseEvents.get() # Block and wait for mouse event
      if type(mouseEvent) == mouse.Events.Scroll: # Scroll
        scroll = True
      elif type(mouseEvent) == mouse.Events.Click and mouseEvent.pressed and mouseEvent.button == mouse.Button.left: # Left click
        listener.stop() # Stop listener
        elementId = parseHtml(True) # Parse html
        pyautogui.click() # Second click
        break
      elif type(mouseEvent) == mouse.Events.Click and mouseEvent.pressed and mouseEvent.button == mouse.Button.right: # Right click
        listener.stop() # Stop listener
        elementSelector = parseHtml(False) # Parse html
        pyautogui.click() # Second click
        break

    subprocess.Popen(['xclip','-se','c','-d',':0','/dev/null']) # Clear clipboard 

    if isInput:
      isInput = False # reset isInput
      with keyboard.Events() as keyboardBlock:
        while True:
          keyboardEvent = keyboardBlock.get() # Block on keyboard input
          if type(keyboardEvent) == keyboard.Events.Press: # Only check for presses
            try:
              textInput += keyboardEvent.key.char
            except AttributeError:
              if keyboardEvent.key == keyboard.Key.space:
                textInput += ' '
              elif keyboardEvent.key == keyboard.Key.backspace:
                textInput = textInput[:-1]
              else:
                break

    while type(mouseEvent) == mouse.Events.Move or type(mouseEvent) == mouse.Events.Scroll or type(mouseEvent) == mouse.Events.Click: 
      try:
        mouseEvent = mouseEvents.get(0.01) # Trash all mouse events
      except queue.Empty:
        break

    goToTextEditor() # Go to text editor
    time.sleep(pause) # Prevent race conditions

    if back:
      pyautogui.write('await browser.back();\n') # Write code
      back = False # Clear back variable
    elif elementId and scroll:
      pyautogui.write('await scrollIntoViewSimple("%s");\n' % elementId) # Write code
      scroll = False # Clear scroll variable

    if elementId and not textInput:
      pyautogui.write('await simpleClick("%s");\n' % elementId) # Write code
      elementId = '' # Clear element id
    elif elementSelector and not textInput:
      pyautogui.write("await selectClick('%s');\n" % elementSelector) # Write code
      elementSelector = '' # Clear element selector
    elif elementId and textInput:
      pyautogui.write('await simpleTextInput("%s", "%s");\n' % (elementId, textInput)) # Write code
      elementId = '' # Clear element id
      textInput = '' # Clear text input
    elif elementSelector and textInput:
      pyautogui.write("await selectTextInput('%s', '%s');\n" % (elementSelector, textInput)) # Write code
      elementSelector = '' # Clear element selector
      textInput = '' # Clear text input
    else:
      break
