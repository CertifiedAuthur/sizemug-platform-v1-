// Include gulp
var gulp = require("gulp");

// Include Our Plugins
var jshint = require("gulp-jshint");
var less = require("gulp-less");
var minifyCSS = require("gulp-minify-css");
var path = require("path");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync");
var autoprefixer = require("gulp-autoprefixer");

gulp.task("less", function () {
  gulp
    .src("./advancedEditorAssests/less/main.less")
    //.pipe(sourcemaps.init())
    .pipe(less())

    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        remove: false,
      })
    )
    //.pipe(sourcemaps.write())
    .pipe(minifyCSS())
    .pipe(gulp.dest("./advancedEditorAssests/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("integrate-less", function () {
  gulp
    .src("./advancedEditorAssests/less/integrate.less")
    .pipe(less())
    .on("error", function (err) {
      this.emit("end");
    })
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        remove: false,
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest("./advancedEditorAssests/css"))
    .pipe(browserSync.reload({ stream: true }));
});

// Concatenate & Minify JS
gulp.task("scripts", function () {
  return gulp
    .src([
      "advancedEditorAssests/js/editor/resources/colors.js",
      "advancedEditorAssests/js/editor/resources/gradients.js",
      "advancedEditorAssests/js/vendor/jquery.js",
      "advancedEditorAssests/js/vendor/jquery-ui.js",
      "advancedEditorAssests/js/vendor/file-saver.js",
      "advancedEditorAssests/js/vendor/pagination.js",
      "advancedEditorAssests/js/vendor/spectrum.js",
      "advancedEditorAssests/js/vendor/hammer.js",
      "advancedEditorAssests/js/vendor/scrollbar.js",
      "advancedEditorAssests/js/vendor/angular.min.js",
      "advancedEditorAssests/js/vendor/angular-animate.js",
      "advancedEditorAssests/js/vendor/angular-aria.js",
      "advancedEditorAssests/js/vendor/angular-material.js",
      "advancedEditorAssests/js/vendor/angular-sortable.js",
      "advancedEditorAssests/js/vendor/fabric.js",
      "advancedEditorAssests/js/editor/App.js",
      "advancedEditorAssests/js/editor/LocalStorage.js",
      "advancedEditorAssests/js/editor/Settings.js",
      "advancedEditorAssests/js/editor/Keybinds.js",
      "advancedEditorAssests/js/editor/Canvas.js",
      "advancedEditorAssests/js/editor/crop/cropper.js",
      "advancedEditorAssests/js/editor/crop/cropzone.js",
      "advancedEditorAssests/js/editor/crop/cropController.js",
      "advancedEditorAssests/js/editor/basics/RotateController.js",
      "advancedEditorAssests/js/editor/basics/CanvasBackgroundController.js",
      "advancedEditorAssests/js/editor/basics/ResizeController.js",
      "advancedEditorAssests/js/editor/basics/RoundedCornersController.js",
      "advancedEditorAssests/js/editor/zoomController.js",
      "advancedEditorAssests/js/editor/TopPanelController.js",
      "advancedEditorAssests/js/editor/directives/Tabs.js",
      "advancedEditorAssests/js/editor/directives/PrettyScrollbar.js",
      "advancedEditorAssests/js/editor/directives/ColorPicker.js",
      "advancedEditorAssests/js/editor/directives/FileUploader.js",
      "advancedEditorAssests/js/editor/directives/TogglePanelVisibility.js",
      "advancedEditorAssests/js/editor/directives/ToggleSidebar.js",
      "advancedEditorAssests/js/editor/text/Text.js",
      "advancedEditorAssests/js/editor/text/TextController.js",
      "advancedEditorAssests/js/editor/text/TextAlignButtons.js",
      "advancedEditorAssests/js/editor/text/TextDecorationButtons.js",
      "advancedEditorAssests/js/editor/text/Fonts.js",
      "advancedEditorAssests/js/editor/drawing/Drawing.js",
      "advancedEditorAssests/js/editor/drawing/DrawingController.js",
      "advancedEditorAssests/js/editor/drawing/RenderBrushesDirective.js",
      "advancedEditorAssests/js/editor/History.js",
      "advancedEditorAssests/js/editor/Saver.js",
      "advancedEditorAssests/js/editor/filters/FiltersController.js",
      "advancedEditorAssests/js/editor/filters/Filters.js",
      "advancedEditorAssests/js/editor/shapes/SimpleShapesController.js",
      "advancedEditorAssests/js/editor/shapes/StickersController.js",
      "advancedEditorAssests/js/editor/shapes/StickersCategories.js",
      "advancedEditorAssests/js/editor/shapes/SimpleShapes.js",
      "advancedEditorAssests/js/editor/shapes/Polygon.js",
      "advancedEditorAssests/js/editor/objects/ObjectsPanelController.js",
    ])
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("advancedEditorAssests/js"))
    .pipe(browserSync.reload({ stream: true }));
});

// Watch Files For Changes
gulp.task("watch", function () {
  browserSync({
    proxy: "pixie.dev",
  });

  gulp.watch("advancedEditorAssests/js/**/*.js", ["scripts"]);
  gulp.watch("advancedEditorAssests/less/**/*.less", ["less"]);
  gulp.watch("advancedEditorAssests/less/**/integrate.less", ["integrate-less"]);
});

// Default Task
gulp.task("default", ["less", "scripts", "watch"]);
