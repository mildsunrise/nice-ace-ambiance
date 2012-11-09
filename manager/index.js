#!/usr/bin/env node

var rimraf = require('rimraf')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , stylus = require('stylus')
  , nib = require('nib')
  , stylexpress = require('./lib/stylexpress')
  , colors = require('colors')

// COMPILING PROCESS //////////////////////////////////////////////////////////

var src = path.join(__dirname, '../src')
  , dest = path.join(__dirname, '../dist')

function asset(p, cb) {
  var r = fs.createReadStream(path.join(src,p))
  r.pipe(fs.createWriteStream(path.join(dest,p)))
  r.on('end',cb)
}

console.log('Compiling Ambiance...'.bold.yellow)

async.series([
  function(cb) {
    // Remove previous build
    rimraf(dest, cb)
  },

  function(cb) {
    // Make build directory
    fs.mkdir(dest,cb)
  },

  function(cb) {
    // Compile stylesheet
    stylexpress({
      src: src, dest: dest,
      styles: "ambiance"
    }, function(styl) {
      styl.set('compress', true)
      styl.use(nib())
    }, cb)
  },

  // Copy assets

  function(cb) {
    asset('noise.png', cb)
  },

  function(cb) {
    asset('ambiance.js', cb)
  }


], function(err) {
  if (err) {
    console.log('Errors found when compiling.'.bold.red)
    process.exit(1)
  }
  console.log('Compiled successfully.'.bold.green)
  if (process.argv[2]=='demo') runDemo()
})

// DEMOSTRATION SERVER ////////////////////////////////////////////////////////

function runDemo() {

  var express = require('express')
    , app = express()

  app.set('view engine', 'blade')
  app.set('views', __dirname)

  app.use('/js', express.static(dest))
  app.use(express.static(__dirname+'/public'))

  app.get('/', function (req,res) {
    fs.readFile(__dirname+'/lib/stylexpress.js', 'utf8', function (err,code) {
      res.render('index', {code: code})
    })
  })

  var port = process.env.PORT || 12032
  app.listen(port, 'localhost', function () {
    console.log(('Demo server ready, browse to '+'http://localhost:%s/'.cyan.underline).bold, port)
    console.log('Press Control-C to quit.')
  })

}
