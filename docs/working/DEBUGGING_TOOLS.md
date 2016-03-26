# Debugging Tools and Tips

## Viewing server logs
  If you would like to see the server logs while developing, you can follow these steps.

### Get an SSH key
  1. If you already have an SSH key you'd like to use, skip to the next section. Otherwise...
  2. Open a terminal on your local computer and enter the following: ssh-keygen -t rsa -C "your_email@example.com" ...
  3. Just press <Enter> to accept the default location and file name. ...
  4. Enter, and re-enter, a passphrase when prompted. ...
  5. You're done!

### Get authorized and log in:
  1. Run cd ~/.ssh/ at the command line.
  3. Copy the contents of the file id_rsa.pub (your public key).
  4. Email the key to servers@wevoteusa.org.
  5. You will receive an email with a command to login (ssh <username>@ec2-52-32-204-163.us-west-2.compute.amazonaws.com)
  6. Run the command, if prompted 'Are you sure you want to continue?' Type yes.
  7. You should now be logged in.

### Viewing Server Logs
1. To view server errors, run tail -F /var/log/wevote/wevoteserver.log
2. To view all the server activity, run tail -F /var/log/upstart/wevote-api.log
3. To only view activity that is coming from localhost:3000 on your computer, run tail -F /var/log/upstart/wevote-api.log | grep <voter_device_id>
4. Note: You can get your device_id by navigating to localhost:3000, opening chrome developer tools and finding the cookie labeled voter_device_id (under Resources > Cookies > Localhost)

---

Next: [Issues and Reporting Bugs](ISSUES.md)

[Go back to Readme Home](../../README.md)

