FROM registry.grupo.corp/pm2:latest

#RUN apt-get update -y
#RUN apt-get install vim -y
#RUN apt-get install tmux -y

ENV SERVER_PORT = 3000

# Bundle APP files
COPY package.json /app


# Environment variables
#ENV DATABASE_HOST = 
#ENV DATABASE_USER = 
#ENV DATABASE_PASS = 
#ENV DATABASE_PORT = 
#ENV DATABASE_NAME = 


# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN cd app && npm install --only=production
WORKDIR /app
COPY . /app


EXPOSE 3000

#CMD [ "pm2-runtime", "start", "pm2.json", "--env" , "test", "-i", "max", "--web"]
CMD [ "node", "/app/app.js"]