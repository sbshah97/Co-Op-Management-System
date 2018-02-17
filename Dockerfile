FROM mhart/alpine-node:latest

RUN rm -rf /tmp/node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/coop && cp -a /tmp/node_modules /opt/coop/

WORKDIR /opt/coop
ADD . /opt/coop

EXPOSE 8080

CMD ["npm", "start"]