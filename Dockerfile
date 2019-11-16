FROM node:alpine AS dev
CMD [ "yarn", "dev" ]
ARG NODE_ENV=dev
WORKDIR /opt/app

COPY package.json yarn.loc[k] ./
RUN yarn install
COPY . ./



FROM node:alpine AS build
ARG NODE_ENV=dev
WORKDIR /opt/app
RUN apk add --no-cache jq
COPY --from=dev /opt/app ./

RUN yarn test
RUN yarn build
RUN echo -e "$( jq 'del(.main, .scripts, .devDependencies)' package.json )" > dist/src/package.json

RUN cp -rfT dist/src ../build
RUN ls -A1 | xargs rm -rf
RUN cp -rT ../build ./
RUN rm -r ../build