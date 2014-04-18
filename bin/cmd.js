#!/usr/bin/env node
var minimist = require('minimist');
var fs = require('fs');
var predict = require('../');

var handleResult = function(err, result) {
  if(err) {
    console.error(err.message || err);
    process.exit(1);
  }
  console.log(result);
};

var argv = minimist(process.argv.slice(2), {
    alias: { e: 'email', k: 'keyfile', m: 'model', p: 'project', i: 'csv' }
});

var csvFile = argv.csv;

if (argv.h || argv.help) usage(0);

var command = argv._[0];

switch(command) {
  case 'analyze':
    predict.analyze(argv.e, argv.k, argv.p, argv.m, handleResult);
    break;
  case 'delete':
    predict.delete(argv.e, argv.k, argv.p, argv.m, handleResult);
    break;
  case 'get':
    predict.get(argv.e, argv.k, argv.p, argv.m, handleResult);
    break;
  case 'insert':
    predict.insert(argv.e, argv.k, argv.p, argv.m, csvFile, handleResult);
    break;
  case 'list':
    predict.list(argv.e, argv.k, argv.p, handleResult);
    break;
  case 'predict':
    predict.predict(argv.e, argv.k, argv.p, argv.m, argv._[1], handleResult);
    break;
  case 'update':
    predict.update(argv.e, argv.k, argv.p, argv.m, csvFile, handleResult);
    break;
    
  default:
    usage(1);
}

function usage (code) {
  var s = fs.createReadStream(__dirname + '/usage.txt');
  s.pipe(code ? process.stderr : process.stdout);
  s.on('end', function () {
    if (code) process.exit(code);
  });
}
