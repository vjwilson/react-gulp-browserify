var gulp = require('gulp');

var paths = {
  src: {
    html: 'src/index.html'
  },
  dev: {
    dest: 'dev_build'
  },
  prod: {
    dest: 'prod_build'
  }
};

gulp.task('copy', function(){
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dev.dest));
});
