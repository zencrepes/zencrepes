# Inspiration from:
# - https://github.com/jshimko/meteor-launchpad/
# - https://github.com/cloud66-samples/blog/blob/webinar_codeship_meteor/Dockerfile.production
#FROM node:8.9.0
FROM node:12-stretch
MAINTAINER Francois Gerthoffert <fg@mail.gerthoffert.net>

ENV GOSU_VERSION 1.11
ENV APP_SOURCE_DIR /opt/meteor/src
ENV APP_BUNDLE_DIR /opt/meteor/dist

COPY . $APP_SOURCE_DIR

# Prepare system
RUN apt-get update
RUN apt-get install -y apt-transport-https ca-certificates
RUN apt-get install -y --no-install-recommends curl bzip2 bsdtar build-essential python git wget

RUN wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-amd64" && \
    chmod +x /usr/local/bin/gosu && \
    gosu nobody true && \
    apt-get purge -y --auto-remove wget

# Install & build Meteor
RUN curl -sL https://install.meteor.com | /bin/sh

RUN cd $APP_SOURCE_DIR && \
    export METEOR_ALLOW_SUPERUSER=true && \
    meteor npm install && \
    mkdir -p $APP_BUNDLE_DIR && \
    METEOR_PROFILE=100 METEOR_DEBUG_BUILD=1 meteor build --directory $APP_BUNDLE_DIR --server-only && \
    cd $APP_BUNDLE_DIR/bundle/programs/server/ && \
    meteor npm install --production --verbose && \
    chown -R node:node $APP_BUNDLE_DIR

#COPY $APP_SOURCE_DIR/entrypoint.sh $APP_BUNDLE_DIR/bundle/entrypoint.sh
RUN mv $APP_SOURCE_DIR/entrypoint.sh $APP_BUNDLE_DIR/bundle/entrypoint.sh
RUN chmod +x $APP_BUNDLE_DIR/bundle/entrypoint.sh

# Default values for Meteor environment variables
ENV ROOT_URL http://localhost
ENV MONGO_URL mongodb://127.0.0.1:27017/meteor
ENV PORT 3000

EXPOSE 3000

WORKDIR $APP_BUNDLE_DIR/bundle

# start the app
ENTRYPOINT ["bash","./entrypoint.sh"]
CMD ["node", "main.js"]
