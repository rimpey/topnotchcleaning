var gulp = require('gulp');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files');
var autoprefixer = require('autoprefixer');
var postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
var plugins = require('gulp-load-plugins')();
var config = require('./config.json');
var ghPages = require('gulp-gh-pages');

gulp.task('sass:inject', function () {
    return gulp
        .src('src/scss/main.scss')
        .pipe(plugins.inject(gulp.src(mainBowerFiles({ filter: '**/*.scss' }).concat(['src/scss/**/*.scss', '!src/scss/main.scss']), {read: false}), {
            starttag: '// inject:scss',
            endtag: '// endinject',
            relative: true,
            transform: function (filepath) {
                return '@import "' + filepath + '";';
            }
        }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    var bowerSassFiles = mainBowerFiles({ 
        filter: '**/*.scss',
        includeDev: true
    });
    var bowerSassIncludePaths = bowerSassFiles.map(path.dirname);

    return gulp
        .src('src/scss/main.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            includePaths: bowerSassIncludePaths
        }))
        .pipe(plugins.postcss([
            postcssFlexbugsFixes, 
            autoprefixer({ browsers: config.plugins.autoprefixer.browsers })
        ]))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch(['src/scss/**/*.scss', '!src/scss/main.scss'], gulp.series('sass'));
    gulp.watch('src/markup/**/*.html', gulp.series('markup', function reload (done) {
        browserSync.reload();
        done();
    }));
    gulp.watch('src/js/**/*.js')
        .on('change', function(path, stats) {
            console.log('File ' + path + ' was changed, running tasks...');
            browserSync.reload();
        });
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
});

gulp.task('useref', function () {
    return gulp
        .src('src/*.html')
        .pipe(plugins.useref())
        .pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(plugins.if('*.css', plugins.cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp
        .src('src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function () {
    return gulp
        .src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function () {
    return del('dist');
});

gulp.task('markup', function () {
    return gulp
        .src('src/markup/*.html')
        .pipe(plugins.injectPartials({
            removeTags: true,
            end: '<!-- endpartial -->'
        }))
        .pipe(plugins.inject(gulp.src(mainBowerFiles({includeDev: true}).concat(['src/js/**/*.js', 'src/css/**/*.css']), {read: false }), { 
            removeTags: true,
            addRootSlash: false,
            ignorePath: 'src/'
        }))
        .pipe(plugins.htmlReplace({
            fonts: {
                src: config.assets.fonts.google,
                tpl: '<link href="//fonts.googleapis.com/css?family=%s" rel="stylesheet" type="text/css">'
            }
        }, {
            keepBlockTags: false
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('githubpages', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
})

gulp.task('dist', gulp.series('clean:dist', 'sass', 'markup', gulp.parallel('useref', 'images', 'fonts'), 'githubpages'));

gulp.task('default', gulp.series('sass', 'markup', gulp.parallel('browserSync', 'watch')));