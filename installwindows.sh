# Sept 2022:  This file has not been maintained in years, and probably no longer work

#!s/usr/bin/env bash

function error() { echo -e "\e[1;31m$1\e[0m"; exit 1; }
function success() { echo -e "\e[1;32m$1\e[0m"; }

[[ "$1" == "" ]] && error "$0 <github username>"
gituser=$1
minNodeVersion="v10.12.0"
minNpmVersion="6.4.1"

echo "[*] Updating..." && sudo apt update -y && success "[+] Updated successfully" || error "[-] Failed to update"
 
echo "[*] Upgrading..." && sudo apt upgrade -y && success "[+] Upgraded successfully" || error "[-] Failed to upgrade"
 
echo "[*] Installing xclip..."
which xclip >/dev/null && success "[+] Xclip already installed" || (sudo apt install xclip >/dev/null 2>&1  && success "[+] Installed xclip" || error "[-] Failed to install xclip")

echo "[*] Installing git..."
which git >/dev/null && success "[+] Git already installed" || (sudo apt install git >/dev/null 2>&1  && success "[+] Installed git" || error "[-] Failed to install git")

echo "[*] Installing pip..." 
which pip3 >/dev/null && success "[+] Pip already installed" || (sudo apt install python3-pip >/dev/null 2>&1 && success "[+] Installed pip" || error "[-] Failed to install pip")

echo "[*] Installing nodeenv..." 
which nodeenv >/dev/null && success "[+] Nodeenv already installed" || (sudo -H pip install nodeenv >/dev/null 2>&1 && success "[+] Installed nodeenv" || error "[-] Failed to install nodeenv")

echo "[*] Installing node..."
which node >/dev/null && success "[+] Node already installed" || (sudo apt install node >/dev/null 2>&1 && success "[+] Installed node" || error "[-] Failed to install node")

echo "[*] Checking node and npm versions..."
[[ "`echo -e "$(node -v)\n$minNodeVersion" | sort -V | head -n 1`" == "$nodeVersion" && "$nodeVersion" != "$minNodeVersion" ]] && error "node is not up to date"
[[ "`echo -e "$(npm -v)\n$minNpmVersion" | sort -V | head -n 1`" == "$npmVersion" && "$npmVersion" != "$minNpmVersion" ]] && error "npm is not up to date"
success "[+] Node and npm are up to date"

echo "[*] Making node environment..."
[[ -d "$HOME/NodeEnvironments/WebAppEnv" ]] && success "[+] Node environment already created" && cd $HOME/NodeEnvironments/ || (mkdir $HOME/NodeEnvironments/ && cd $HOME/NodeEnvironments/ && nodeenv WebAppEnv && success "[+] Node environment created" || error "[-] Failed to create node environment")

echo "[*] Activating Web App Environment and rebuilding node-sass..."
. $HOME/NodeEnvironments/WebAppEnv/bin/activate && npm rebuild node-sass && success "[+] Activated Web App Environment and rebuilt node-sass" || error "[-] Failed to activate Web App Environment or rebuild node-sass"

echo "[*] Cloning git repository..."
[[ -d "$HOME/MyProjects/WebApp" ]] && success "[+] Git repository already cloned" && cd $HOME/MyProjects/WebApp || (mkdir $HOME/MyProjects/ && cd $HOME/MyProjects/ && git clone https://github.com/$gituser/WebApp.git && cd WebApp && success "[+] Cloned git repository" || error "[-] Failed to clone git repository")

echo "[*] Setting path..."
[[ `echo $PATH | grep /usr/local/bin` != "" ]] && success "[+] Path already set" || (export PATH="/usr/local/bin:$PATH" && success "[+] Added /usr/local/bin to path" || error "[-] Failed to add /usr/local/bin to path")

echo "[*] Adding git remote url..."
[[ "`git remote | grep upstream`" == "upstream" ]] && success "[+] Already added git remote url" || (git remote add upstream git@github.com:wevote/WebApp.git && success "[+] Added git remote url" || error "[-] Failed to add git remote url")

echo "[*] Adding config.js..."
[[ -f "$HOME/MyProjects/WebApp/src/js/config.js" ]] && success "[+] config.js already exists" || (cp src/js/config-template.js src/js/config.js && success "[+] Added config.js" || error "[-] Failed to add config.js")

echo "[*] Adding browserstack.config.js..."
[[ -f "$HOME/MyProjects/WebApp/tests/browserstack/browserstack.config.js" ]] && success "[+] browserstack.config.js already exists" || (cp tests/browserstack/browserstack.config-template.js tests/browserstack/browserstack.config.js && success "[+] Added browserstack.config.js" || error "[-] Failed to add browserstack.config.js")

echo "[*] Installing npm packages..."
{
npm install fsevents 
npm install 
} >/dev/null 2>&1 && success "[+] Installed npm packages" || error "[-] Failed to install npm packages"

echo "[*] Adding ssh key..."
[[ -f "$HOME/.ssh/id_rsa" ]] && success "[+] ssh key already exists" || (ssh-keygen -q -t rsa -b 4096 -N '' -f "$HOME/.ssh/id_rsa" && success "[+] Created ssh key" || error "[-] Failed to create ssh key")

echo "[*] Adding ssh key to ssh authentication agent..."
ssh-add ~/.ssh/id_rsa 2>/dev/null && success "[+] Added ssh key to ssh authentication agent" || error "[-] Failed to add ssh key to ssh authentication agent"

echo "[*] Copying ssh key to ssh authentication agent..."
xclip -se c < ~/.ssh/id_rsa.pub >/dev/null && success "[+] Copied ssh key to clipboard" || error "[-] Failed to copy ssh key to clipboard"

success "[*] Done"

echo -e "\e[33;1mGo to your "Settings" page in GitHub (click on your avatar on the top right). In the left navigation, choose "SSH and GPG keys".
Click the "New SSH key" button on the top right.
Paste the contents of the "~/.ssh/id_rsa.pub" key file (which you alerady copied to your clipboard) into the "Key" text area, and give it any Title you would like. Then go back to the terminal and run the command 'git remote set-url origin git@github.com:$gituser/WebApp.git' followed by 'git config --global user.name "$gituser"'.]\e[0m"
