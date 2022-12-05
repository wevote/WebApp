#!/usr/bin/env bash
cd /opt/MyProjects/WebApp/tests/browserstack; . /opt/NodeEnvironments/WebAppEnv/bin/activate;

# Run ballot tests
# Browser
python config.py -g -s ballot -b Browser -r -w
python config.py -g -s ballot -b iOS -r -w
python config.py -g -s ballot -b Android -r -w
# Mobile
python config.py -g -s ballot -a -m -d -b iOS -r -w
python config.py -g -s ballot -a -m -d -b Android -r -w

# Run profile tests
# Browser
python config.py -g -s profile -b Browser -r -w
python config.py -g -s profile -b iOS -r -w
python config.py -g -s profile -b Android -r -w 
# Mobile
python config.py -g -s profile -a -m -d -b iOS -r -w
python config.py -g -s profile -a -m -d -b Android -r -w

# Run ready tests
# Browser
python config.py -g -s ready -b Browser -r -w
python config.py -g -s ready -b iOS -r -w
python config.py -g -s ready -b Android -r -w
# Mobile
python config.py -g -s ready -a -m -d -b iOS -r -w
python config.py -g -s ready -a -m -d -b Android -r -w
