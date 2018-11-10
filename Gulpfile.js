// dependencies
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
const cssmin = require("gulp-cssnano");

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
      .transform('uglifyify', { global: true })
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

// October 2018: bootstrap-sccs is styling for bootstrap 3, so we no longer use it.
// Pull all bootstrap styling from the node_modules package bootstrap (v4)
gulp.task("compile-bootstrap", function () {
  return gulp.src("./node_modules/bootstrap/scss/bootstrap.scss")
    .pipe(sourcemaps.init())
    .on("error", function (err) { console.error(err); })
    .pipe(sass({ style: "expanded",
      includePaths: [
        "./node_modules/bootstrap/sccs",
        "./node_modules/bootstrap/sccs/utilities",
        "./node_modules/bootstrap/sccs/mixins",
      ], }))
    .pipe(autoprefixer("last 2 version"))
    .pipe(cssmin())
    .pipe(sourcemaps.write(".")) // --> working directory is /build/css
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

// Compile main and loading-screen, then copy them to the /build/css directory
gulp.task("sass", function () {
  return gulp.src(["./src/sass/main.scss",
                   "./src/sass/loading-screen.scss",
    ])
    .pipe(sourcemaps.init())
    .on("error", function (err) { console.error(err); })
    .pipe(sass({ style: "expanded" }))
    .pipe(autoprefixer("last 2 version"))
    .pipe(cssmin())
    .pipe(sourcemaps.write(".")) // --> working directory is /build/css
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

gulp.task("lint-css", function () {
  const gulpStylelint = require("gulp-stylelint");
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [
        { formatter: "string", console: true },
      ],
    }));
});

// Clean out Build directory
gulp.task("clean:build", function (done) {
  return del(["./build/**"], done);
});

// Copy font files to Build directory
gulp.task("copy-fonts", function (done) {
  gulp.src("./src/sass/base/fonts/**")
    .pipe(gulp.dest("./build/fonts"))
    .pipe(browserSync.stream());
  done();
});

// Copy Index page to Build directory
gulp.task("copy-index", function (done) {
  gulp.src("./src/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
  done();
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
gulp.task("build", gulp.series("copy-fonts", "copy-index", "compile-bootstrap", "copy-css", "copy-img", "copy-javascript", "browserify", "sass"));

// Watch tasks
gulp.task("watch", PRODUCTION ? ()=> {} : function (done) {
  gulp.watch("./src/index.html", gulp.parallel("copy-index")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/sass/base/base/fonts/**", gulp.parallel("copy-fonts")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/sass/bootstrap/**", gulp.parallel("compile-bootstrap")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/css/**/*.scss", gulp.parallel("copy-css", "lint-css")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/img/**/*", gulp.parallel("copy-img")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/sass/**/*.scss", gulp.parallel("sass")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/javascript/*.js", gulp.parallel("copy-javascript")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  gulp.watch("./src/js/**/*.js?(x)", gulp.parallel("browserify")).on("change", function (path) {
    console.log("Watcher: " + path + " was changed.");
    done();
  });

  done();
});

// Default
gulp.task("default", gulp.series(
  "clean:build",
  "build",
  "watch",
  "server"
));
