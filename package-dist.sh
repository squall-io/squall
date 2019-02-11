#!/usr/bin/env sh

[[ ${NODE_ENV} = "build" ]] && yarn test && \
    yarn build && rm -Rf src spec && if [ 1 -eq 1 ]; then
        rm -f package-dist.sh
        rm -f tsconfig.json
        rm -f helper.d.ts
        mv dist/src/ ./
        rm -Rf dist/
        node package-dist.js
        rm -f package-dist.js
        yarn install --production
    fi
