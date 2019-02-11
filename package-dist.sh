#!/usr/bin/env sh

[[ ${NODE_ENV} = "build" ]] && yarn test && \
    yarn build && rm -Rf src spec && if [ 1 -eq 1 ]; then
        rm -f package-dist.sh
        rm -f tsconfig.json
        mv dist/src/ ./
        rm -Rf dist/
        node package-dist.js
        rm -f package-dist.js
        yarn install --production
        # TODO: publish package if version differs from public one
    fi
