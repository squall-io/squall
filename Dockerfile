FROM node:dubnium-alpine
ENV NODE_ENV=build
WORKDIR /opt/app/
COPY package.json yarn.loc[k] /opt/app/
RUN yarn install --non-interactive
COPY package-dist.sh /opt/app/
COPY package-dist.js /opt/app/
COPY tsconfig.json /opt/app/
COPY helper.d.ts /opt/app/
COPY spec/ /opt/app/spec/
COPY src/ /opt/app/src/
RUN chmod a+x package-dist.sh && ./package-dist.sh
