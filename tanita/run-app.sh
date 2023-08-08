#!/bin/bash

load_nvm() {
  # load nvm
  export NVM_DIR="${HOME}/.nvm"
  [ ! -s "${NVM_DIR}/nvm.sh" ] || \. "${NVM_DIR}/nvm.sh"

  if [ ! is_container ]; then
    sudo /sbin/ldconfig

    (sudo timedatectl set-local-rtc 0 && sudo timedatectl set-ntp 1) || true
  fi
}

load_nvm
nvm use
echo "node version"
node --version
echo "npm version"
npm --version
node index.js
