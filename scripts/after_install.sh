#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /var/apps/interview/interview

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#navigate into our working directory where we have all our github files
cd /var/apps/interview/interview

#install node modules
npm ci
npm install pm2 -g

#migrate database
npx sequelize-cli db:migrate --env test
npx sequelize-cli db:seed:all --env test