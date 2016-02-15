/// <vs Clean='prod' />
//**************************
// Set the production Paths
//**************************

// Location to source your scss files from. Usually a specific file, but you can use **/*.scss wildcard
var styles_src				= 'src/sass/*.scss'; 

// Destination to send your compiled CSS. Will also send a production ready minified css file to this directory
var styles_dest				= 'web/assets/styles/'; 

// CSS Files from vendors
var vendor_styles = [
	'src/vendor/datepicker/jquery.datepick.css',
]

var js_dest		= 'web/assets/scripts/'; // Destination to send your compiled JS scripts to. Will also send a production ready minified css file to this directory

var js_filename	= 'scripts.js';

// Array of Javascript files to concatenate and minify
var js_concat = [
	'src/js/**/*',
];

// Array of Javascript files to move as-is. Will not concatenate or minify
var js_src = [
	'src/vendor/datepicker/jquery.datepick.min.js',
	'src/vendor/datepicker/jquery.datepick.min.js',
	'src/vendor/datepicker/jquery.plugin.min.js',
	'src/vendor/jquery/dist/jquery.min.js',
	'src/vendor/modernizr/modernizr.js',
	'src/vendor/moment/moment.js',
	'src/js-to-copy/**/*'
];

// Array of directories (and those to skip) to validate HTML
var validate_src = 'public/**/*.html';

// Array of directories and font files to copy to production assets
var fonts_src = [
	'src/media/fonts/**/*',
];
var fonts_dest = 'web/assets/media/fonts'; // Destination to send your font files

var img_src		= 'src/media/images/**/*'; // Directory to copy all images from. This will grab all file extensions.
var img_dest	= 'LeeCountyV2.Umbraco/assets/media/images'; // Destination to send all images to.

// Directories to wipe out. Be careful. Everything in these directories will be deleted.
var clean_dir = [
	'web/assets/styles',
	'web/assets/scripts',
	'web/assets/media/images'
];

//---------------------------------------------------------------------------------------------
// Load the dependencies
//---------------------------------------------------------------------------------------------

var gulp			= require('gulp'),
    sass			= require('gulp-sass'),
    autoprefixer	= require('gulp-autoprefixer'),
    csscomb			= require('gulp-csscomb'),
    minifycss		= require('gulp-minify-css'),
    htmlhint		= require("gulp-htmlhint"),
    uglify 			= require('gulp-uglify'),
    imagemin 		= require('gulp-imagemin'),
    rename 			= require('gulp-rename'),
    rimraf			= require('gulp-rimraf'),
    concat 			= require('gulp-concat'),
    notify 			= require('gulp-notify'),
    plumber 		= require('gulp-plumber'),
    gutil			= require('gulp-util'),
    runSequence		= require('run-sequence'),
    pngquant        = require('imagemin-pngquant'),
    gulpif          = require('gulp-if'),
    filesize		= require('gulp-filesize');

var onError = function (err) {
  gutil.beep();
  console.log(err);
};



//---------------------------------------------------------------------------------------------
// TASK: Styles
//---------------------------------------------------------------------------------------------

gulp.task('styles', function () {
	gulp.src(vendor_styles)
		.pipe(gulp.dest(styles_dest))

	return gulp.src(styles_src)
		.pipe(plumber())
    	.pipe(sass({ style: 'expanded'}).on('error', sass.logError).on('error', onError))
    	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(csscomb())
		.pipe(gulp.dest(styles_dest))
		.pipe(filesize())
		.pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({processImport: false}))
        .pipe(gulp.dest(styles_dest))
        .pipe(filesize())
		.pipe(notify({ message: 'Styles task complete' }));
});

//---------------------------------------------------------------------------------------------
// TASK: scripts
//---------------------------------------------------------------------------------------------

gulp.task('scripts', function() {

	gulp.src(js_src)
		.pipe(gulp.dest(js_dest))
		.pipe(filesize())
		.pipe(notify({ message: 'Scripts copy task complete.' }));


	return gulp.src(js_concat)
		.pipe(concat(js_filename))
		.pipe(gulp.dest(js_dest))
		.pipe(filesize())
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(js_dest))
		.pipe(filesize())
		.pipe(notify({ message: 'Scripts concat task complete.' }));
});


//---------------------------------------------------------------------------------------------
// TASK: fonts
//---------------------------------------------------------------------------------------------
gulp.task('fonts', function() {

	return gulp.src(fonts_src)
		.pipe(gulp.dest(fonts_dest))
		.pipe(notify({ message: 'Fonts task complete.' }))
		.pipe(filesize());
});


//---------------------------------------------------------------------------------------------
// TASK: Images
//---------------------------------------------------------------------------------------------

gulp.task('images', function () {
    return gulp.src(img_src)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(img_dest))
        .pipe(filesize());
});

//---------------------------------------------------------------------------------------------
// TASK: Validate
//---------------------------------------------------------------------------------------------

gulp.task('validate', function() {

  return gulp.src(validate_src)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});


//---------------------------------------------------------------------------------------------
// TASK: Clean
//---------------------------------------------------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(clean_dir, { read: false }) // much faster
    .pipe(rimraf({ force: true }))
    .pipe(notify({ message: 'Clean task complete.' }));
});





//---------------------------------------------------------------------------------------------
// PRODUCTION TASK: Run `gulp prod`
// This is the production task, It will clean out all of the specified directories,
// compile and minify your sass, concatencate and minify your scripts, move necessary
// fonts, and compress and move images to the assets directory.
//---------------------------------------------------------------------------------------------

gulp.task('prod', function() {
	runSequence('clean',
    ['styles', 'scripts', 'fonts', 'images', 'validate']);
});


//---------------------------------------------------------------------------------------------
// DEVELOPMENT/WATCH TASK: Run `gulp`
// This is the development task. It is the task you will primarily use. It will watch
// for changes in your sass files, and recompile new CSS when it sees changes. It
// will do the same for javascript files as well.
//---------------------------------------------------------------------------------------------

gulp.task('default', function() {

	// Watch .scss files
	gulp.watch('src/**/*.scss', function(event) {
	    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	    gulp.start('styles');
	});
	
	// Watch .js files
	gulp.watch('src/js/**/*.js', function(event) {
	    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	    gulp.start('scripts');
	});

	// Watch .html files
	gulp.watch('public/**/*.html', function(event) {
	    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	    gulp.start('validate');
	});
	
	// Watch IMG files
	gulp.watch('src/media/images/**/*', function(event) {
	    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	    gulp.start('images');
	});

});
