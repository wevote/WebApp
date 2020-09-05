# Ubuntu 20.04
#!/usr/bin/env bash
 
function error() { echo -e "\e[1;31m$1\e[0m"; exit -1; }
function success() { echo -e "\e[1;32m$1\e[0m"; }
 
 
echo "[*] Updating..." && sudo apt update -y >/dev/null 2>&1 && success "[+] Updated successfully" || error "[-] Failed to update"
 
echo "[*] Upgrading..." && sudo apt upgrade -y && success "[+] Upgraded successfully" || error "[-] Failed to upgrade"
 
echo "[*] Installing python dependencies..."
dpkg -l python-psycog2 python-dev >/dev/null 2>&1 && success "[+] Python dependencies already installed" || (sudo apt install python-psycog2 python-dev >/dev/null 2>&1  && success "[+] Installed python dependencies" || error "[-] Failed to install python dependencies")
 
echo "[*] Installing postgresql..."
dpkg -l postgresql postgresql-client postgresql-contrib >/dev/null 2>&1 && success "[+] Postgresql already installed" || (sudo apt install postgresql postgresql-contrib postgresql-client >/dev/null 2>&1  && success "[+] Installed postgresql" || error "[-] Failed to install postgresql")
 
#echo '\password postgres\n\q' | sudo -u postgres psql postgres
#sudo -u postgres createdb WeVoteServerDB
