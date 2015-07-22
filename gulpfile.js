var gulp = require('gulp');

// plugins
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
//var gutil = require('gulp-util');
//var bower = require('bower');

//var sass = require('gulp-sass');
//var minifyCss = require('gulp-minify-css');
//var rename = require('gulp-rename');
//var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

// tasks
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('copy-app', function () {
    gulp.src(['app/**/*'], {
        base: '.'
    }).pipe(gulp.dest('www'));
});

gulp.task('clean', function() {
    gulp.src('./www/app')
        .pipe(clean({force: true}));
});

gulp.task('connect', function () {
    connect.server({
        root: 'www',
        port: 11000
    });
});

gulp.task('browserify', function() {
    gulp.src(['app/app.module.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundled.js'))
        .pipe(gulp.dest('www/app'))
});

gulp.task('default', ['browserify','copy-app','connect']);


