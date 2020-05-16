var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

var cleancss = require('gulp-clean-css');
//var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var wait = require('gulp-wait');
var browserSync = require('browser-sync').create();

const reload = browserSync.reload;

// configure the paths
var watch_dir = './scss/**/*.scss';
var src_dir = './scss/**/*.scss';
var dest_dir = './css-compiled';

var paths = {
    source: src_dir
};

gulp.task('sass', function() {
  return gulp.src(paths.source) 
  //https://github.com/olefredrik/FoundationPress/issues/731
  // wait is required to prevent weired error in VS-Code
    //.pipe(wait(1000))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded', precision: 10})
      .on('error', sass.logError) 
    )
    .pipe(autoprefixer({
      //browsers: ['last 1 versions'],
      cascade: false
      }))
    // write unminified main.css
    .pipe(gulp.dest(dest_dir))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest_dir))  
    .pipe(browserSync.reload({ stream:true }));
});

gulp.task('serve', () => {
  browserSync.init({
      proxy: "http://localhost/website/projects/grav-admin/"
  });
  
   gulp.watch('./scss/**/*.scss', gulp.series('sass'));//.on('change', reload);
   gulp.watch('./blueprints/*.yaml').on('change', reload);
   gulp.watch('./js/**/*.js').on('change', reload);
   gulp.watch('./templates/**/*.twig').on('change', reload);  
   gulp.watch('../../pages/**/*.md').on('change', reload);
   gulp.watch('../../config/**/*.yaml').on('change', reload); 
});

gulp.task('default', gulp.parallel('serve','sass'));
