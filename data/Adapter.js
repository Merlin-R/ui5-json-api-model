const Models = require('./Models').Models;
const API    = require('json-api');
const matchSyntaxTxt = `
"regex" expects a minimum of two and a maximum of three arguments:
a field identifier, a regex literal and optional regex flags
For example: (fullname,:regex,\`Bob.*\`,\`i\`)
`.trim()
const Adapter = new API.dbAdapters.Mongoose( Models );

API.dbAdapters.Mongoose.supportedOperators[ 'regex' ] = {
  finalizeArgs( operators, operator, args ) {
    if ( args.length < 2 || args.length > 3 ) throw new SyntaxError( matchSyntaxTxt );
    try {
      new RegExp( args[ 1 ], args[ 2 ] );
    } catch ( e ) {
      throw new SyntaxError( matchSyntaxTxt + '\n' + e );
    }
    return args;
  }
};


module.exports = Adapter;
