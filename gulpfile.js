const { 
    src, 
    dest, 
    parallel, 
    series, 
    watch, 
    on
}                   = require('gulp');
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const sass          = require('gulp-sass')(require('sass'));
const cleancss      = require('gulp-clean-css');
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const del           = require('del');
const theme         = 'theme-name';



function browsersync(){
    browserSync.init({
        //server: { baseDir: 'wp/' }, // Указываем папку сервера
        proxy: 'hostname/wp',
		notify: true, // Отключаем уведомления
		online: true // Режим работы: true или false
    })
}

function scripts() {
	return src([ // Берем файлы из источников
	    'assets/jquery/jquery.min.js',
        'assets/jquery/jquery.easing.min.js',
        'assets/jquery/jquery-ui.min.js',
		'assets/jquery/jquery.ui.touch-punch.min.js',
        'assets/jquery/jquery.mask.min.js',
        'assets/swiper/swiper-bundle.min.js',
        'assets/fancybox/jquery.fancybox.min.js'
	])
	.pipe(concat('libs.min.js')) // Конкатенируем в один файл
	//.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('theme/js')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream())
}

function sassstyles() {
	return src([ // Берем файлы из источников
	    'theme/sass/style.scss',
	])
    .pipe(sourcemaps.init())
	.pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(dest('theme')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream())
}

function cssstyles() {
	return src([ // Берем файлы из источников
		'assets/jquery/jquery-ui.min.css',
	    'assets/bootstrap/grid-1800/bootstrap-grid.min.css',
		'assets/bootstrap/icons/bootstrap-icons.css',
        'assets/swiper/swiper-bundle.min.css',
        'assets/fancybox/jquery.fancybox.min.css'
		//'assets/fontawesome/all.min.css'
	])
    .pipe(concat('libs.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
    .pipe(dest('theme/css'))
}

function themereload() {
    del.sync([
        'wp/wp-content/themes/' + theme + '/**', 
        '!wp/wp-content/themes/' + theme + '', 
        '!wp/wp-content/themes/' + theme + '/languages/**'
    ]);
    return src([
	    'theme/**/*',
		'!theme/sass',
        '!theme/sass/',
        '!theme/sass/**/*',
		'!theme/languages/**/*',
	])
    .pipe(dest('wp/wp-content/themes/' + theme + ''))
}

function startwatch() {
    watch([
        'theme/js/*.js',
        '!theme/js/libs.min.js'
    ], series(scripts, themereload))
	watch([
        'theme/sass/**/*.scss',
    ], series(sassstyles, themereload))
    watch([
        'theme/**/*.php',
    ], themereload).on('change', browserSync.reload)
}

exports.browsersync  = browsersync;
exports.scripts      = scripts;
exports.cssstyles    = cssstyles;
exports.sassstyles   = sassstyles;
exports.startwatch   = startwatch;
exports.themereload  = themereload;
exports.default      = parallel(scripts, sassstyles, cssstyles, themereload, browsersync, startwatch);