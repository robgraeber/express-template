var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    clean = require('gulp-rimraf'),
    browserSync = require('browser-sync'),
    reloadMe = require('browser-sync').reload,
    imageMin = require('gulp-imagemin'),
    webpack = require('gulp-webpack'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    cssMin = require('gulp-minify-css'),
    nib = require('nib'),
    es = require('event-stream'),
    ts = require('gulp-typescript'),
    merge = require('event-stream').concat;
    
var compiledDir = './compiled',
    publicDir = compiledDir+'/public',
    publicImgDir = compiledDir+'/public/img',
    tsProject = ts.createProject({
        module: 'commonjs',
        sortOutput: true
    });

var webpackAppJS = function(minifyMe) {
    return gulp.src('./app/scripts/main.js')
    .pipe(webpack({}))
    .pipe(concat('app.js'))
    .pipe(gulpif(minifyMe, uglify()))
    .pipe(gulp.dest(publicDir));
};

var compileServerJS = function(){
    return gulp.src(['./**/*.ts', '!./node_modules/**/*', '!./app/scripts/**/*'])
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest(compiledDir));
};

var concatCSS = function(minifyMe) {
    return gulp.src([
        './app/styles/**/*.styl'
    ])
    .pipe(stylus({use: [nib()]}))
    .pipe(concat('app.css'))
    .pipe(gulpif(minifyMe, cssMin()))
    .pipe(gulp.dest(publicDir))
    .pipe(reloadMe({stream:true}));
};

var copyImages = function() {
    return gulp.src([
        './app/img/**/*'
    ], { base: './app' })
    .pipe(filterEmptyDirs())
    .pipe(gulp.dest(publicDir));
};

var copyViews = function() {
    return gulp.src([
        './app/views/**/*'
    ], { base: './' })
    .pipe(filterEmptyDirs())
    .pipe(gulp.dest(compiledDir));
};


//removes empty dirs from stream
var filterEmptyDirs = function() {
    return es.map(function (file, cb) {
        if (file.stat.isFile()) {
            return cb(null, file);
        } else {
            return cb();
        }
    });
};

var minifyImages = function() {
    return gulp.src([
        publicImgDir+'/**/*'
    ])
    .pipe(imageMin())
    .pipe(gulp.dest(publicImgDir));
};

//opens up browserSync url
var syncMe = function() {
    browserSync({
        proxy: 'localhost:8000',
        open: false
    });
};

//cleans build folder
gulp.task('clean', function() {
    return gulp.src([compiledDir],{read: false})
    .pipe(clean());
});

//build + watching, for development
gulp.task('default', ['clean'], function() {

    gulp.watch(['./app/scripts/**/*.js'], function() {
        console.log('File change - webpackAppJS()');
        webpackAppJS()
        .pipe(reloadMe({stream:true}));
    });
    gulp.watch('./app/styles/**/*.styl', function() {
        console.log('File change - concatCSS()');
        concatCSS();
    });
    gulp.watch(['./app/img/**/*'], function() {
        console.log('File change - copyImages()');
        copyImages()
        .pipe(reloadMe({stream:true}));
    });
    gulp.watch(['./**/*.ts', '!./node_modules/**/*', '!./app/scripts/**/*'], function() {
        console.log('File change - compileServerJS()');
        compileServerJS();
    });

    return merge(copyImages(), copyViews(), concatCSS(), webpackAppJS(), compileServerJS())
    .on('end', function() {
        syncMe();
    });
});

//production build task
gulp.task('build', ['clean'], function() {
    return merge(copyImages(), copyViews(), webpackAppJS(true), concatCSS(true), compileServerJS())
    .on('end', function() {
        minifyImages();
    });
});
