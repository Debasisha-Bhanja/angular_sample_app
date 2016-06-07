// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var open = require('gulp-open');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var print = require('gulp-print');
var util = require('gulp-util');

// tasks
gulp.task('lint', function() {
    gulp.src(['./js/app/**/*.js', '!./app/bower_components/**'])
        .pipe(jshint().on('error', util.log))
        .pipe(jshint.reporter('default').on('error', util.log))
        .pipe(jshint.reporter('fail').on('error', util.log));
});

gulp.task('clean', function() {
   return gulp.src('./dist/**/*')
        .pipe(clean({force: true}).on('error', util.log));
});
gulp.task('minify-css', function() {
    var opts = {comments:true,spare:true};
   return gulp.src('./css/**/*.css')
        .pipe(minifyCSS(opts).on('error', util.log))
        .pipe(gulp.dest('./dist/css').on('error', util.log));
});
gulp.task('thirdparty-css', function() {
	var opts = {comments:true,spare:true};
   return gulp.src('./thirdparty/css/*.css')
		.pipe(print())
		.pipe(minifyCSS(opts).on('error', util.log))
        .pipe(gulp.dest('./dist/thirdparty/css').on('error', util.log));
  });


// minify new or changed HTML pages
gulp.task('minify-index', function() {
  var htmlSrc = './index.html',
      htmlDst = './dist';

 return gulp.src(htmlSrc)
	.pipe(print())
    //.pipe(changed(htmlDst).on('error', util.log))
    .pipe(minifyHTML().on('error', util.log))
	.pipe(gulp.dest(htmlDst).on('error', util.log));
});

// minify new or changed HTML pages
gulp.task('minify-html', function() {
  var htmlSrc = './partials/**/*.html',
      htmlDst = './dist/partials/';

 return gulp.src(htmlSrc)
	.pipe(print())
    //.pipe(changed(htmlDst))
    .pipe(minifyHTML().on('error', util.log))
	  .pipe(print())
    .pipe(gulp.dest(htmlDst).on('error', util.log))
	  .pipe(print());
	
});
// JS concat, strip debugging and minify
gulp.task('minify-js', function() {
 return  gulp.src(['./app/**/**/*.js'])
    .pipe(print())
    .pipe(concat('app.min.js').on('error', util.log))
    .pipe(stripDebug().on('error', util.log))
    .pipe(uglify().on('error', util.log))
    .pipe(gulp.dest('./dist/js/').on('error', util.log));
});

gulp.task('thirdparty-js', function() {
  return  gulp.src('./thirdparty/js/*.js')
		.pipe(print())
        .pipe(gulp.dest('./dist/thirdparty/js').on('error', util.log));
  });

gulp.task('copy-bower-components', function () {
 return  gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
   return gulp.src('./partials/**/*.html')
		.pipe(print())
        .pipe(gulp.dest('./dist/partials/'));
});
gulp.task('connect', function () {
 return connect.server({
        root: 'app/',
        port: 8888
    });
});
gulp.task('connectDist', function () {
  return connect.server({
        root: 'dist/',
        port: 9999,
	    livereload: true,
		fallback: 'dist/index.html'
    });
});

gulp.task('openIndex', function(){
return gulp.src('')
.pipe(open({app: 'chrome', uri: 'http://localhost:9999'}).on('error', util.log));
});



// default task
gulp.task('default',
    ['lint', 'connect']
);
gulp.task('build', function() {
    runSequence(
        ['clean'],
        ['lint','thirdparty-css', 'minify-css','thirdparty-js','minify-js','minify-html','minify-index'],
		['connectDist'],
		['openIndex']
    );
	 // watch for HTML changes
  gulp.watch('./partials/**/*.html', function() {
    gulp.run('minify-html');
  });

 gulp.watch('./index.html', function() {
    gulp.run('minify-index');
  });
  // watch for JS changes
  gulp.watch('./app/**/**/*.js', function() {
    gulp.run('lint', 'minify-js');
  });

  // watch for CSS changes
  gulp.watch('./css/**/*.css', function() {
    gulp.run('minify-css');
  });
});
