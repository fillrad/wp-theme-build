'use strict';

// VARS

var OSname       = 'default.com/wp'; // Open server site folder name
var themeName    = 'main-theme'; // Folder theme name in Wordpress directory
var gulp         = require('gulp'),
	sass         = require('gulp-sass'), 
	sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'), 
    uglify       = require('gulp-uglifyjs'),
    concat       = require('gulp-concat'),
    browserSync  = require('browser-sync'),
    zip          = require('gulp-zip'),
    del          = require('del');

// TASKS

gulp.task('sass', function(){
	return gulp.src('theme/sass/style.scss')
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
	.pipe(autoprefixer({
        cascade: false
    }))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('theme'))
});

gulp.task('css', function(){
	return gulp.src([
    //  'assets/Bootstrap/grid-1140/bootstrap-grid.min.css', // CSS llibraries files
    //  'assets/Bootstrap/grid-1560/bootstrap-grid.min.css',
    ])
	.pipe(concat('libraries.css'))
    .pipe(gulp.dest('theme/css'))
});

gulp.task('script', function(){
	return gulp.src([
    //  'assets/jquery/dist/jquery.min.js', // JS llibraries files
    ])
	.pipe(concat('libraries.js'))
    .pipe(gulp.dest('theme/js'))
});

gulp.task('clear', function(){
    del.sync(['wp/wp-content/themes/' + themeName + '/**', '!wp/wp-content/themes/' + themeName + '', '!wp/wp-content/themes/' + themeName + '/languages/**']);
});

gulp.task('browser-sync', function(){
	browserSync({
        proxy: '' + OSname + '',
        notify: false
    });
});

gulp.task('theme', ['clear', 'sass', 'css', 'script'], function(){
    return gulp.src([
		'theme/**/*',
		'!theme/sass',
		'!theme/sass/**/*',
		'!theme/languages/**/*',
        '!theme/sass/',
    ])
    .pipe(gulp.dest('wp/wp-content/themes/' + themeName + ''))
});

gulp.task('build', ['theme'], function(){
    return del.sync([
        //'wp/wp-content/themes/' + themeName + '/sass'
    ])
});

gulp.task('watch', ['browser-sync', 'build'], function(){
    gulp.watch('theme/sass/**/*.scss', ['build', browserSync.reload])
    gulp.watch('theme/**/*.php', ['build', browserSync.reload])
    gulp.watch('theme/js/*.js', ['build', browserSync.reload])
});

gulp.task('zip-theme', ['build'], function(){
    return gulp.src('wp/wp-content/themes/' + themeName + '/**/*')
    .pipe(zip('' + themeName + '.zip'))
    .pipe(gulp.dest('zipFiles'))
});

gulp.task('zip-wp', ['build'], function(){
    return gulp.src('wp/**/*')
    .pipe(zip('full-wp-' + themeName + '.zip'))
    .pipe(gulp.dest('zipFiles'))
});

gulp.task('default', ['watch']);