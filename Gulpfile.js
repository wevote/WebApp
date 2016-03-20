// dependencies
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  del = require('del'),
  server = require('./server');

gulp.task('browserify', function () {
  return browserify({
    entries: 'js/index.js',
    extensions: ['.js','.jsx'],
    basedir: './src',
    transform: [babelify]
  })
  .bundle()
  .on('error', function(err) {
    console.error(err.toString());
    this.emit('end')
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
});

gulp.task('server', function () {
  browserSync.init({
    proxy: 'localhost:3003',
    open: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    logPrefix: "We Vote USA"
  });
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
  .on('error', function(err) { console.error(err); })
  .pipe(sass())
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
});

gulp.task('clean:build', function () {
  return del.sync(['./build/**'])
});

gulp.task('copy-fonts', function () {
  gulp.src('./src/sass/base/fonts/**')
    .pipe(gulp.dest('./build/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('copy-index', function () {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('copy-css', function () {
  return gulp.src('./src/css/**/*.css')
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('build', ['copy-fonts', 'copy-index', 'copy-css', 'browserify', 'sass']);

gulp.task('watch', ['build'], function () {
  gulp.watch(['./src/index.html'], ['copy-index']);
  gulp.watch(['./src/sass/base/base/fonts/**'], ['copy-fonts']);
  gulp.watch(['./src/css/**/*.css'], ['copy-css']);
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
  gulp.watch(['./src/js/**/*.js?(x)'], ['browserify'])
});

gulp.task('default', [
  'clean:build',
  'watch',
  'server'
]);
