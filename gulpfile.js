'use strict';

// VARS

var OSname       = 'default.com'; // Open server site name
var themeName    = 'default'; // Folder theme name in Wordpress directory
var gulp         = require('gulp'),
	sass         = require('gulp-sass'), 
    autoprefixer = require('gulp-autoprefixer'), 
    uglify       = require('gulp-uglifyjs'),
    concat       = require('gulp-concat'),
    browserSync  = require('browser-sync'),
    zip          = require('gulp-zip'),
    del          = require('del');

// TASKS

gulp.task('sass', function(){
	return gulp.src('theme/sass/style.scss')
	.pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
	.pipe(gulp.dest('theme'))
});

gulp.task('css', function(){
	return gulp.src([
    //  '/libs/Bootstrap/grid-1140/bootstrap-grid.min.css', // CSS llibraries files
    //  'theme/libs/Bootstrap/grid-1560/bootstrap-grid.min.css',
		'theme/libs/default/default.css',
    ])
	.pipe(concat('libraries.css'))
    .pipe(gulp.dest('theme/css'))
});

gulp.task('script', function(){
	return gulp.src([
    //  'theme/libs/jquery/dist/jquery.min.js', // JS llibraries files
		'theme/libs/default/default.js',
    ])
	.pipe(concat('libraries.js'))
    .pipe(gulp.dest('theme/js'))
});

gulp.task('clear', function(){
    return del.sync('wp/wp-content/themes/' + themeName + '')
});

gulp.task('browser-sync', function(){
	browserSync({
        proxy: '' + OSname + '',
        notify: false
    });
});

gulp.task('theme', ['clear', 'sass', 'css', 'script'], function(){
    return gulp.src([
        '!theme/libs/**/*',
        '!theme/sass/**/*',
        'theme/**/*',
    ])
    .pipe(gulp.dest('wp/wp-content/themes/' + themeName + ''))
});

gulp.task('build', ['theme'], function(){
    return del.sync([
        'wp/wp-content/themes/' + themeName + '/sass',
        'wp/wp-content/themes/' + themeName + '/libs'
    ])
});

gulp.task('watch', ['browser-sync', 'build'], function(){
    gulp.watch('theme/sass/**/*.scss', ['build', browserSync.reload])
    gulp.watch('theme/**/*.php', ['build', browserSync.reload])
    gulp.watch('theme/js/common.js', ['build', browserSync.reload])
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