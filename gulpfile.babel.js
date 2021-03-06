import gulp from "gulp"
import { series, watch } from "gulp"
import browserSync from "browser-sync"
import browserify from "browserify"
import babelify from "babelify"
import source from "vinyl-source-stream"
import { start } from "repl";

const html = () => {
  return gulp.src('./app/*.html')
             .pipe(gulp.dest('./build'))
             .pipe(browserSync.stream())
}

const libs = () => {
  return gulp.src('./app/libs/*.js')
             .pipe(gulp.dest('./build/libs'))
             .pipe(browserSync.stream())
}

const js = () => {
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
}

const startServer = () => {
  browserSync.init({
    server: "./build"
  })
}

gulp.task('watch', () => {
  gulp.watch(['./app/js/**/*.js'], ['js'])
  gulp.watch(['./app/*.html'], ['html'])
  gulp.watch(['./app/shaders/*.glsl'], ['js'])
})

exports.build = series(html, libs, js)
exports.dev = series(startServer, watch)
exports.default = series(startServer, watch)
