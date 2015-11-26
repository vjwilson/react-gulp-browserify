var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps')

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

gulp.task('copy', function(){
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dev.root));
});

// build app styles
gulp.task('css:app', function() {
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

function compile(watch) {
  var bundler = watchify(
    browserify(paths.src.entry, {
      debug: true
    }).transform(babelify)
  );

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

  if (watch) {
    bundler.on('update', function() {
      console.log('-> rebundling...');
      rebundle();
    });
  }

  rebundle();

}

function watch() {
  return compile(true);
}

gulp.task('browserify', function() {
  return compile();
});
gulp.task('watchify', function() {
  return watch();
});

gulp.task('build', ['copy', 'css:app', 'browserify']);
gulp.task('watch', ['copy', 'css:app', 'watchify']);


gulp.task('default', ['watch']);

// // build app js
// gulp.task('js:app', function() {
//   return gulp.src(paths.src.js)
//     .pipe(uglify())
//     .pipe(gulp.dest(paths.dev.js));
// });

// function bundle_js(bundler) {
//   return bundler.bundle()
//     .on('error', map_error)
//     .pipe(source('app.js'))
//     // .pipe(buffer())
//     // .pipe(gulp.dest('app/dist'))
//     // .pipe(rename('app.min.js'))
//     // .pipe(sourcemaps.init({ loadMaps: true }))
//     //   // capture sourcemaps from transforms
//     //   .pipe(uglify())
//     // .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(paths.dev.js))
// }

// // Without watchify
// gulp.task('browserify', function () {
//   var bundler = browserify(paths.src.root + '/assets/js/app.js', { 
//     cache: {},
//     packageCache: {},
//     fullPaths: false,
//     debug: true
//   });

//   return bundle_js(bundler);
// });
