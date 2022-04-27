const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const gulpif = require('gulp-if');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const copy = require('gulp-copy');
const browserSync = require("browser-sync").create();
const filter = require('gulp-filter');

gulp.task('clean-dist', function () {
    return gulp.src('dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task('scss', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(process.env.NODE_ENV != 'dev', autoprefixer({
            cascade: false
        })))
        .pipe(gulpif(process.env.NODE_ENV != 'dev', uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        })))
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulpif(process.env.NODE_ENV == 'dev', browserSync.reload({ stream: true })));
});

gulp.task('js', function () {
    let b = browserify({
        entries: './js/entry.js',
        debug: process.env.NODE_ENV == 'dev'
    });

    return b.bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpif(process.env.NODE_ENV == 'dev', sourcemaps.init({ loadMaps: true })))
        .pipe(gulpif(process.env.NODE_ENV != 'dev', uglify()))
        .pipe(gulpif(process.env.NODE_ENV == 'dev', sourcemaps.write('./')))
        .pipe(gulp.dest('./dist/'))
        .pipe(filter('**/*.js'))
        .pipe(gulpif(process.env.NODE_ENV == 'dev', browserSync.reload({ stream: true })));
});

gulp.task('html', function () {
    return gulp.src('./index.html')
        .pipe(copy('./dist/'))
        .pipe(gulpif(process.env.NODE_ENV == 'dev', browserSync.reload({ stream: true })));
});
gulp.task('public', function () {
    return gulp.src('./public/**/*')
        .pipe(copy('./dist/'))
        .pipe(gulpif(process.env.NODE_ENV == 'dev', browserSync.reload({ stream: true })));
});

gulp.task('watch', function () {
    browserSync.init({
        port: 4000,
        ui: {
            port: 4001
        },
        server: {
            baseDir: "./dist",
            index: "index.html"
        }
    });
    gulp.series(gulp.task('clean-dist'), gulp.task('html'), gulp.task('public'), gulp.task('scss'), gulp.task('js'))()
    gulp.watch('scss/**/*.scss', gulp.task('scss'));
    gulp.watch('js/entry.js', gulp.task('js'));
    gulp.watch('index.html', gulp.task('html'));
});

gulp.task('build', gulp.series(gulp.task('clean-dist'), gulp.task('public'), gulp.task('html'), gulp.task('scss'), gulp.task('js')));