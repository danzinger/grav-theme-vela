var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
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
  gulp.src(paths.source)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 1 versions'],
      cascade: false
      }))      
    .pipe(gulp.dest(dest_dir))
    .pipe(csscomb())
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dest_dir)); 
});

gulp.task('serve', () => {
  browserSync.init({
      proxy: "http://localhost/website/projects/for-teachers/"
  });
  
  gulp.watch('./scss/**/*.scss', ['sass']).on('change', reload);
  gulp.watch('./blueprints/*.yaml').on('change', reload);
  gulp.watch('./templates/**/*.twig').on('change', reload);  
  gulp.watch('../../pages/**/*.md').on('change', reload);
  gulp.watch('../../config/**/*.yaml').on('change', reload);
});

gulp.task('default', ['serve','sass']);
