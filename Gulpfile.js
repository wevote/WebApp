// dependencies
const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const del = require("del");
const server = require("./server");
const closureCompiler = require("gulp-closure-compiler");

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
  .on("error", function (err) { console.error(err); })
  .pipe(sass())
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

gulp.task("copy-css", function () {
  return gulp.src("./src/css/**/*.css")
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

gulp.task("build", ["copy-fonts", "copy-index", "copy-css", "browserify", "sass"]);

gulp.task("watch", ["build"], PRODUCTION ? ()=>{} : function () {
  gulp.watch(["./src/index.html"], ["copy-index"]);
  gulp.watch(["./src/sass/base/base/fonts/**"], ["copy-fonts"]);
  gulp.watch(["./src/css/**/*.css"], ["copy-css"]);
  gulp.watch(["./src/sass/**/*.scss"], ["sass"]);
  gulp.watch(["./src/js/**/*.js?(x)"], ["browserify"]);
});

gulp.task("default", [
  "clean:build",
  "watch",
  "server"
]);
