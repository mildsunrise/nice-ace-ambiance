// Offers highly configurable Stylus rendering (one-time, no middleware).
// You can choose which stylesheets to serve and
// which options to pass to the compiler.
//
// This should also be externalized, if possible.
// requires: stylus, async, mkdirp

var path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , async = require('async')
  , stylus = require('stylus');

function startswith(str, pref) {
  return str.substr(0,pref.length) == pref;
}
function endswith(str, suff) {
  return str.substr(str.length-suff.length) == suff;
}
function contains(list, item) {
  return list.indexOf(item) != -1;
}

var defaultopt = {
  'prefix': '/',
  'cssext': '.css',
  'stylusext': '.styl',
  'encoding': 'utf8',
  'watch': false,
  'strict': true
};

function matches(myopt, name) {
  if (endswith(name, myopt.stylusext)) {
    var sheet = name.substr(0,name.length-myopt.stylusext.length);
    var styles = myopt.styles;
    for (i=0; i<styles.length; i++) {
      var style = styles[i];
      if (style instanceof RegExp) {
        if (style.test(sheet)) return sheet;
      } else {
        if (style==sheet) return sheet;
      }
    }
  }
}

function renderFile(file, enc, hisopt, cb) {
  return fs.readFile(file, enc, function (err, str) {
    if (err) {
      console.warn('Couldn\'t read stylesheet %s: %s', file, err);
      return cb(err);
    }
    if (hisopt instanceof Function) return stylus(str)
      .set('filename', file)
      .use(hisopt)
      .render(cb);
    
    hisopt.filename = file;
    return stylus.render(str, hisopt, cb);
  });
}

function renderDir(name, dstdir, myopt, hisopt, cb) {
  var dir = path.join(myopt.src, name);
  fs.readdir(dir, function (err,files) {
    if (err) return next(err);
    var mdir = true;
    return async.forEach(files, function (filebase, next) {
      var nname = path.join(name,filebase);
      var file = path.join(myopt.src,nname);

      return fs.stat(file, function (err, stats) {
        if (err) {
          console.warn('Couldn\'t stat %s: %s', file, err);
          return next(myopt.strict? err : null);
        }
        if (stats.isDirectory())
          return renderDir(nname, dstdir, myopt, hisopt, function(err) {
            if (err) console.warn('When rendering styles folder %s: %s', file, err);
            return next(myopt.strict? err : null);
          });

        var sheet = matches(myopt, nname);
        if (!sheet) return next();
        return renderFile(file, myopt.encoding, hisopt, function (err,css) {
          if (err) {
            console.error('When rendering Stylus file:\n'+err);
            return next(myopt.strict? err : null);
          }

          var dst = path.join(dstdir, sheet+myopt.cssext);
          function writeStyles() {
            return fs.writeFile(dst, css, myopt.encoding, function (err) {
              if (err) console.error('Couldn\'t write CSS file:\n'+err);
              return next(myopt.strict? err : null);
            });
          }
          if (mdir) {
            return mkdirp(dir, function (err, made) {
              if (err) {
                console.error('Error when making directories %s: %s', dir, err);
                return next(myopt.strict? err : null);
              }
              mdir = false;
              return writeStyles();
            });
          }
          return writeStyles();
        });
      });
    }, cb);
  });
}

function render(myopt, hisopt, cb) {
  if (myopt === undefined) myopt = {};
  if (hisopt === undefined) hisopt = {};
  for (var a in defaultopt) if (!(a in myopt)) myopt[a] = defaultopt[a];

  if (!('src' in myopt) || !('dest' in myopt) || !('styles' in myopt))
    throw new Error('You must specify the stylesheets, source and destination directory.');

  var dstdir = path.join(myopt.dest, myopt.prefix);

  if (!(myopt.styles instanceof Array)) myopt.styles = [myopt.styles];

  return renderDir('', dstdir, myopt, hisopt, function (err) {
    if (err) console.error('Couldn\'t read main directory %s: %s', myopt.src, err);
    if (myopt.watch) {
      //TODO: watch
    }
    return cb();
  });
}

module.exports = render;
