#!/usr/bin/env sh

npx ts-node "$( yarn bin jasmine )" \
&& rm -Rf ./dist \
&& npx tsc --pretty --project ./src \
&& cd ./src \
&& find . -type f -not -name "*.ts" -exec cp --parents "{}" /opt/app/dist/ \; \
&& cd ../ && node -e "
let package = require( './package.json' );
package.main = 'index.js';
delete package.devDependencies;
package.scripts = { start: 'node index.js' };
package = JSON.stringify( package, null, '  ' );
console.log( package );" > dist/package.json
