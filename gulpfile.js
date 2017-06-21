let gulp = require('gulp')
let sass = require('gulp-sass')
let ts = require('gulp-typescript')
let tsProject = ts.createProject('tsconfig.json')
let browserSync = require('browser-sync')
let browserify = require('browserify')
let tsify = require('tsify')
let source = require('vinyl-source-stream')

gulp.task('default', ['watch'])

gulp.task('watch', ['bundle', 'sass', 'html'], () => {
  browserSync.init({
    server: 'dist',
    notify: false
  })
  gulp.watch('src/sass/*sass', ['sass'])
  gulp.watch('src/ts/*.ts', ['bundle'])
  gulp.watch('src/*.html', ['html'])
})

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('sass', () => {
  return gulp.src('src/sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
})

gulp.task('ts', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('src/js'))
})

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist/js'))
})

gulp.task('bundle', ['ts', 'js'], () => {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream())
})
