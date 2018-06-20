var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('dist-clean', function () {
    return gulp.src('dist/', {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('pages-clean', function () {
    return gulp.src([
                        'pages/assets/css/',
                        'pages/assets/fonts/',
                        'pages/assets/js/'
                    ],
                    {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('build-css', function () {

    var cssDestinationDir = 'pages/assets/css/';
    var scssSourceDir = 'scss/**/*.scss';

    return gulp.src(scssSourceDir)
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(cssDestinationDir))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(cssDestinationDir));
});

gulp.task('copy-fonts-assets', function () {
    return gulp.src([
                        'node_modules/font-awesome/fonts/*'
                    ])
        .pipe(gulp.dest('pages/assets/fonts/'))
});

gulp.task('copy-css-assets', function () {
    return gulp.src([
                        'node_modules/font-awesome/css/font-awesome.min.css'
                    ])
        .pipe(gulp.dest('pages/assets/css/'))
});

gulp.task('copy-js-assets', function () {
    return gulp.src([
                        'node_modules/jquery/dist/jquery.slim.min.js',
                        'node_modules/bootstrap/dist/js/bootstrap.min.js',
                        'node_modules/popper.js/dist/umd/popper.min.js'
                    ])
        .pipe(gulp.dest('pages/assets/js/'))
});

gulp.task('dist-copy-html', function () {
    return gulp.src(['pages/*.html'])
        .pipe(gulp.dest('dist/'))
});

gulp.task('dist-copy-css', function () {
    return gulp.src(['pages/assets/css/*.min.*'])
        .pipe(gulp.dest('dist/assets/css/'))
});

gulp.task('dist-copy-js', function () {
    return gulp.src(['pages/assets/js/*.min.*'])
        .pipe(gulp.dest('dist/assets/js/'))
});

gulp.task('dist-copy-fonts', function () {
    return gulp.src(['pages/assets/fonts/*'])
        .pipe(gulp.dest('dist/assets/fonts/'))
});

gulp.task('dist-copy-img', function () {
    return gulp.src(['pages/assets/img/*'])
        .pipe(gulp.dest('dist/assets/img/'))
});

gulp.task('pages-build',
          gulp.series(
              'pages-clean',
              'build-css',
              'copy-js-assets',
              'copy-css-assets',
              'copy-fonts-assets'
          )
);

gulp.task('dist-build',
          gulp.series(
              'dist-clean',
              'pages-build',
              gulp.parallel(
                  'dist-copy-html',
                  'dist-copy-css',
                  'dist-copy-js',
                  'dist-copy-fonts',
                  'dist-copy-img'
              )
          )
);

gulp.task('serve-reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('serve-watch-pages',
          function () {
              browserSync.init({
                                   server: {
                                       baseDir: "./pages"
                                   }
                               });
              gulp.watch('pages/*.html', gulp.series('serve-reload'));
              gulp.watch('pages/assets/**/*', gulp.series('serve-reload'));
              gulp.watch('scss/**/*.scss', gulp.series('build-css', 'serve-reload'));
          });

gulp.task('serve-dist',
          function () {
              browserSync.init({
                                   server: {
                                       baseDir: "./dist"
                                   }
                               });
          });

gulp.task('default', gulp.series('dist-build'));

