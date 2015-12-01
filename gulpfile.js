var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint');
    concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles', function() {
  return sass('src/assets/sass/application.scss', {style: 'expanded'})
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({message: 'Styles task complete!'}));
});

gulp.task('scripts', function() {
  gulp.src('src/assets/javascripts/application.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('dist/assets/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/javascripts'));

  gulp.src('src/assets/javascripts/jquery*.min.js')
    .pipe(gulp.dest('dist/assets/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 2, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({message: 'Images task complete!'}));
});

gulp.task('files', function() {
  gulp.src('src/**/*.html')
  .pipe(gulp.dest('dist/'));

  gulp.src('src/manifest.json')
  .pipe(gulp.dest('dist/'))
  .pipe(notify({message: 'Files task complete!'}));
});

gulp.task('clean', function() {
  return del(['src/**/*.html', 'dist/assets/css', 'dist/assets/images', 'dist/assets/javascripts']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('files', 'styles', 'scripts', 'images');
});

gulp.task('watch', function() {
  gulp.watch('src/assets/sass/**/*.scss', ['styles']);
  gulp.watch('src/assets/javascripts/**/*.js', ['scripts']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('src/**/*.html', ['files']);

  livereload.listen();

  gulp.watch(['dist/**']).on('change', livereload.changed);
});