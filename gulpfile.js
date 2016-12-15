var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
// automatically loads plugins in the package.json
var plugins = require('gulp-load-plugins')();

/* DEVELOPMENT TASKS  */

// compile sass to css with sourcemaps
gulp.task('sass', function () {
    return gulp
        .src('src/scss/main.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream()); // No need to refresh browser as can just update css
});

// init browserSync to serve from src directory
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
});

// tell broswerSync to refresh browser 
gulp.task('refresh', function () {
    browserSync.reload();
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', ['refresh']);
    gulp.watch('src/js/**/*.js', ['refresh']);
});

// copy font awesome from vendor folder to src/fonts
gulp.task('fonts:src', function() {
    return gulp
        .src('src/vendor/font-awesome/fonts/**.*')
        .pipe(gulp.dest('src/fonts'));
});



/* DEPLOYMENT TASKS */

gulp.task('clean:dist', function () {
    return del('dist');
});

// combines and minifies css and js into single file for each
gulp.task('useref', function () {
    return gulp
        .src('src/*.html')
        .pipe(plugins.useref())
        .pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(plugins.if('*.css', plugins.cssnano()))
        .pipe(gulp.dest('dist'));
});

// copy and optimise images
gulp.task('images', function () {
    return gulp
        .src('src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img'));
});

// copy fonts
gulp.task('fonts:dist', function () {
    return gulp
        .src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

// deploy to github pages
gulp.task('githubpages', function () {
    return gulp.src('dist/**/*')
        .pipe(plugins.ghPages());
});

gulp.task('dist', function () {
    runSequence('clean:dist', 'sass', ['useref', 'images', 'fonts:dist'], 'githubpages');
});

gulp.task('default', ['sass', 'fonts:src', 'browserSync', 'watch']);