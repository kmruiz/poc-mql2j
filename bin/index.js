#!/usr/bin/env node

const process = require('process')
const fs = require('fs')
const emit = require('./backend/java/emit')

const argv = require('yargs')
  .scriptName("mql2j")
  .usage('$0 [args]')
  .option('imports', {
      type: 'boolean',
      alias: 'I',
      default: false,
      describe: 'Print import statements of dependencies so they can be copied into the code. By default it\'s disabled.'
  })
  .option('verbosity', {
      type: 'string',
      alias: 'V',
      default: 'default',
      describe: 'Verbosity of the API usage. It can be "static import" so API methods are not qualified when possible, printing shorter code. Default, uses always qualified calls.'
  })
  .option('wildcardImports', {
      type: 'boolean',
      alias: 'W',
      default: false,
      describe: 'Wether to use wildcard imports in Java, or generate an import per method. If this is true, assumes that imports need to be printed (implies -I). By default it\'s disabled.'
  })
  .help()
  .argv

const jsonString = fs.readFileSync(process.stdin.fd, 'utf-8')
const json = eval("(" + jsonString + ")")
  
const javaCode = emit(json, { verbosity: argv.verbosity, wildcardImport: argv.wildcardImports, printImports: argv.imports || argv.wildcardImports })
console.log(javaCode)