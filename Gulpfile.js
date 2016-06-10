// dependencies
const gulp = require("gulp");
const sass = require("gulp-sass");
const classPrefix = require('gulp-class-prefix');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require("gulp-uglify");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const del = require("del");
const server = require("./server");

const PRODUCTION = process.env.NODE_ENV === "production";

gulp.task("browserify", function () {
  const ops = {
    debug: !PRODUCTION,
    entries: "js/index.js",
    extensions: [".js", ".jsx"],
    basedir: "./src",
    transform: [babelify]
  };

  function err (e){
    console.error(e.toString());
    this.emit("end");
  }

  return PRODUCTION ?

  // production build with minification
  browserify(ops)
    .bundle()
    .on("error", err)
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify({ preserveComments: false, mangle: false }))
    .pipe(gulp.dest("./build/js")) :

  // development build... no minification
  browserify(ops)
    .bundle()
    .on("error", err)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());

});

gulp.task("server", PRODUCTION ? () => server(PRODUCTION) : function () {
  server();
  // only start browserSync when this is development
  browserSync.init({
    proxy: "localhost:3003",
    open: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    logPrefix: `${new Date().toString().split(" ")[4]} - We Vote USA`
  });
});

gulp.task("sass", function () {
  return gulp.src("./src/sass/main.scss")
  .pipe(sourcemaps.init())
  .on("error", function (err) { console.error(err); })
  .pipe(sass({ style: 'expanded' }))
  .pipe(autoprefixer('last 2 version'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("./build/css"))
  .pipe(browserSync.stream());
});

gulp.task("clean:build", function () {
  return del.sync(["./build/**"]);
});

gulp.task("copy-fonts", function () {
  gulp.src("./src/sass/base/fonts/**")
    .pipe(gulp.dest("./build/fonts"))
    .pipe(browserSync.stream());
});

gulp.task("copy-index", function () {
  gulp.src("./src/index.html")
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
});

gulp.task("prefix", ["copy-css"], function() {
  return gulp.src("./build/css/bootstrap.css")
    .pipe(classPrefix("bs-"))
    .pipe(gulp.dest("./build/css"));
});

gulp.task("copy-css", function () {
  return gulp.src("./src/css/**/*.css")
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

gulp.task("copy-img", function () {
  return gulp.src("./src/img/**/*")
    .pipe(gulp.dest("./build/img"))
    .pipe(browserSync.stream());
});

gulp.task("build", ["copy-fonts", "copy-index", "prefix", "copy-css", "copy-img", "browserify", "sass"]);

gulp.task("watch", ["build"], PRODUCTION ? ()=>{} : function () {
  gulp.watch(["./src/index.html"], ["copy-index"]);
  gulp.watch(["./src/sass/base/base/fonts/**"], ["copy-fonts"]);
  gulp.watch(["./build/css/bootstrap.css"], ["prefix"]);
  gulp.watch(["./src/css/**/*.css"], ["copy-css"]);
  gulp.watch(["./src/img/**/*"], ["copy-img"]);
  gulp.watch(["./src/sass/**/*.scss"], ["sass"]);
  gulp.watch(["./src/js/**/*.js?(x)"], ["browserify"]);
});

gulp.task("default", [
  "clean:build",
  "watch",
  "server"
]);
