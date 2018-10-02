// dependencies
const watchify = require("watchify");
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const del = require("del");
const server = require("./server");
const assign = require("lodash.assign");
const cssmin = require("gulp-cssnano");

const config = {
    bootstrapDir: "./node_modules/bootstrap-sass",
    bootstrap4Dir: "./node_modules/bootstrap",
  };

const PRODUCTION = process.env.NODE_ENV === "production";

gulp.task("browserify", function () {
  const ops = {
    debug: !PRODUCTION,
    entries: "js/index.js",
    extensions: [".js", ".jsx"],
    basedir: "./src",
    transform: [babelify],
  };

  // 2017-04-05 Watchify is causing too many problems, so we are turning it off until we can resolve Issue 757
  // var opsWatchify = assign({ cache: {}, packageCache: {} }, watchify.args, ops);
  // var browserifyWithWatchify = watchify(browserify(opsWatchify));

  function err (e) {
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
  // browserifyWithWatchify
  browserify(ops)
    .bundle()
    .on("error", err)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());

});

// Run server
gulp.task("server", PRODUCTION ? () => server(PRODUCTION) : function () {
  server();
  // only start browserSync when this is development
  browserSync.init({
    proxy: "localhost:3003",
    open: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true,
    },
    logPrefix: `${new Date().toString().split(" ")[4]} - We Vote USA`,
  });
});

// Compile Bootstrap allowing for custom variables and selective imports
gulp.task("compile-bootstrap", function () {
    return gulp.src("./src/sass/bootstrap.scss")
    .pipe(sass({
        includePaths: [config.bootstrapDir + "/assets/stylesheets",
                      config.bootstrap4Dir,],
      }))
    .pipe(cssmin())
    .pipe(gulp.dest("./build/css/"));
  });

// Compile main stylesheet and copy to Build directory
gulp.task("sass", function () {
  return gulp.src("./src/sass/{main,loading-screen}.scss")
  .pipe(sourcemaps.init())
  .on("error", function (err) { console.error(err); })
  .pipe(sass({ style: "expanded" }))
  .pipe(autoprefixer('last 2 version'))
  .pipe(cssmin())
  .pipe(sourcemaps.write(".")) // --> working directory is /build/css
  .pipe(gulp.dest("./build/css"))
  .pipe(browserSync.stream());
});

gulp.task("lint-css", function lintCssTask() {
  const gulpStylelint = require("gulp-stylelint");
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(gulpStylelint({
      reporters: [
        { formatter: "string", console: true, },
      ],
    }));
});

// Clean out Build directory
gulp.task("clean:build", function () {
  return del.sync(["./build/**"]);
});

// Copy font files to Build directory
gulp.task("copy-fonts", function () {
  gulp.src("./src/sass/base/fonts/**")
    .pipe(gulp.dest("./build/fonts"))
    .pipe(browserSync.stream());
});

// Copy Index page to Build directory
gulp.task("copy-index", function () {
  gulp.src("./src/index.html")
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
});

// Copy CSS files to Build directory
gulp.task("copy-css", function () {
  return gulp.src("./src/css/**/*.scss")
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

// Copy image files to Build directory
gulp.task("copy-img", function () {
  return gulp.src("./src/img/**/*")
    .pipe(gulp.dest("./build/img"))
    .pipe(browserSync.stream());
});

// Copy javascript files to Build directory
gulp.task("copy-javascript", function () {
  return gulp.src("./src/javascript/*")
    .pipe(gulp.dest("./build/javascript"))
    .pipe(browserSync.stream());
});

// Build tasks
gulp.task("build", ["copy-fonts", "copy-index", "compile-bootstrap", "copy-css", "copy-img", "copy-javascript", "browserify", "sass"]);

// Watch tasks
gulp.task("watch", ["build"], PRODUCTION ? ()=> {} : function () {
  gulp.watch(["./src/index.html"], ["copy-index"]);
  gulp.watch(["./src/sass/base/base/fonts/**"], ["copy-fonts"]);
  gulp.watch(["./src/sass/bootstrap/**"], ["compile-bootstrap"]);
  gulp.watch(["./src/css/**/*.scss"], ["copy-css"]);
  gulp.watch(["./src/css/**/*.scss"], ["lint-css"]);
  gulp.watch(["./src/img/**/*"], ["copy-img"]);
  gulp.watch(["./src/sass/**/*.scss"], ["sass"]);
  gulp.watch(["./src/javascript/*.js"], ["copy-javascript"]);
  gulp.watch(["./src/js/**/*.js?(x)"], ["browserify"]);
});

// Default
gulp.task("default", [
  "clean:build",
  "build",
  "watch",
  "server",
]);
