FROM node:16

WORKDIR /
COPY package.json .
RUN npm install -g nodemon
RUN npm install
COPY . .
#CMD npm start
EXPOSE 6868
ENTRYPOINT ["nodemon", "/var/www/app/app.js"]  
CMD [ "npm", "run", "start_dev" ]