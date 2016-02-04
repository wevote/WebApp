var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var nodemon = require('gulp-nodemon')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var sourcemaps = require('gulp-sourcemaps')
var server = require('./server');

gulp.task('browserify', function () {
  return browserify({
    entries: 'js/index.js',
    extensions: ['.js','.jsx'],
    basedir: './src',
    transform: [babelify]
  })
  .bundle()
  .on('error', function(err) { console.error(err.toString()) })
  .pipe(source('bundle.js'))
  // begin sourcemaps
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('./'))
  // end sourcemaps
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
})

gulp.task('server', function () {
  browserSync.init({
    proxy: 'localhost:3003'
  });
})

gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
  .on('error', function(err) { console.error(err); })
  .pipe(sass())
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
})

gulp.task('copy', function () {
  gulp.src('./src/fonts/**')
    .pipe(gulp.dest('./build/fonts'))

  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'))

  return gulp.src('./src/css/**/*.css')
    .pipe(gulp.dest('./build/css'));
})

gulp.task('build', ['copy', 'browserify', 'sass'])

gulp.task('watch', ['build'], function () {
  gulp.watch(['./src/index.html'], function () {
    return gulp.src('./src/index.html')
      .pipe(gulp.dest('./build'));
  });
  gulp.watch(['./src/sass/**/*.scss'], ['sass'])
  gulp.watch(['./src/js/**/*.js*'], ['browserify'])
})

gulp.task('default', [
  'watch',
  'server'
])
