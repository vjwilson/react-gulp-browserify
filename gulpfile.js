var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var paths = {
  src: {
    root: 'src',
    html: 'src/**/*.html',
    css:  'src/assets/css/**/*.scss',
    js:  'src/assets/js/**/*.js'
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
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10
    }))
    .pipe(gulp.dest(paths.dev.css));
});

  // build app js
  gulp.task('js:app', function() {
    return gulp.src(paths.src.js)
      .pipe(uglify('app.js'))
      .pipe(gulp.dest(paths.dev.js));
  });
