import gulp from "gulp"
import browserSync from "browser-sync"
import browserify from "browserify"
import babelify from "babelify"
import source from "vinyl-source-stream"

gulp.task('html', () => {
  return gulp.src('./app/*.html')
             .pipe(gulp.dest('./build'))
             .pipe(browserSync.stream())
})

gulp.task('libs', () => {
  return gulp.src('./app/libs/*.js')
             .pipe(gulp.dest('./build/libs'))
             .pipe(browserSync.stream())
})

gulp.task('js', () => {
  return browserify({
      entries: ['./app/js/main.js']
  })
  .transform(babelify.configure({
    presets: ['env']
  }))
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream())
})

gulp.task('startServer', () => {
  browserSync.init({
    server: "./build"
  })
})

gulp.task('watch', () => {
  gulp.watch(['./app/js/**/*.js'], ['js'])
  gulp.watch(['./app/*.html'], ['html'])
})

gulp.task('build', ["html", "libs", "js"])
gulp.task('dev', ['startServer', 'watch'])