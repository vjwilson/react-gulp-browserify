var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var del = require('del');

/* nicer browserify errors */
var util = require('gulp-util')

var paths = {
  src: {
    root: 'src',
    html: 'src/**/*.html',
    css:  'src/assets/css/**/*.scss',
    js:  'src/assets/js/**/*.js',
    entry: 'src/assets/js/app.js'
  },
  dev: {
    root: 'dev_build',
    css:  'dev_build/assets/css',
    js:  'dev_build/assets/js'
  },
  prod: {
    dest: 'prod_build',
    css:  'prod_build/assets/css'
  }
};

// Remove previous build
gulp.task('clean', function() {
  return del([paths.dev.root]);
});


// JSHint task
gulp.task('lint', function() {
  gulp.src(paths.src.js)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Build HTML files
gulp.task('copy', ['clean'], function(){
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dev.root));
});

// build app styles
gulp.task('css:app', ['clean'], function() {
  return gulp.src(paths.src.root + '/assets/css/main.scss')
    .pipe(sass({
      sourcemap : true,
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10
    }))
    .pipe(gulp.dest(paths.dev.css));
});

function map_error(err) {
  if (err.fileName) {
    // regular error
    util.log(util.colors.red(err.name)
      + ': '
      + err.fileName.replace(__dirname + '/src/js/', '')
      + ': '
      + 'Line '
      + err.lineNumber
      + ' & '
      + 'Column '
      + (err.columnNumber || err.column)
      + ': '
      + err.description);
  } else {
    // browserify error..
    util.log(util.colors.red(err.name)
      + ': '
      + err.message);
  }

}

function compile(setWatch) {
  var bundler = browserify(paths.src.entry, {
      debug: true,
      cache: {},
      packageCache: {},
      fullPaths: false
    })
    .transform('babelify', {presets: ['es2015', 'react']});

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        map_error(err);
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dev.js))
  }

  if (setWatch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      console.log('-> rebundling...');
      rebundle();
    });
  }

  rebundle();

}

gulp.task('browserify', ['clean'], function() {
  var setWatch = false;
  return compile(setWatch);
});
gulp.task('watchify', ['clean'], function() {
  var setWatch = true;
  return compile(setWatch);
});

gulp.task('build', ['copy', 'css:app', 'browserify']);

gulp.task('watch', ['copy', 'css:app', 'watchify'], function() {
  gulp.watch(paths.src.css, ['css:app']);
});

gulp.task('default', ['watch']);
