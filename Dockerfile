FROM node:alpine AS dev
CMD [ "yarn", "dev" ]
ARG NODE_ENV=dev
WORKDIR /opt/app

COPY package.json yarn.loc[k] ./
RUN yarn install
COPY . ./



FROM node:alpine AS build
RUN apk add --no-cache jq
ARG NODE_ENV=dev
WORKDIR /opt/app

COPY --from=dev /opt/app /opt/~app
RUN yarn --cwd ../~app test
RUN yarn --cwd ../~app build
RUN rm -f ../~app/dist/src/tsconfig.tsbuildinfo
RUN cp -Rf ../~app/LICENSE ../~app/readme.md ../~app/dist/src/* .
RUN echo -e "$( jq '. += { "type": "module" }' ../~app/package.json )" > package.json
RUN echo -e "$( jq 'del(.esm, .main, .scripts, .nodemonConfig, .devDependencies)' ../~app/package.json )" > package.json
RUN rm -Rf ../~app
