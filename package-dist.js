const package = require( './package.json' );
const fs = require( 'fs' );



delete package.devDependencies;
delete package.scripts;
delete package.main;

fs.writeFileSync( './package.json',
    JSON.stringify( package, void 0, 2 ) );
