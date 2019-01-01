let gulp = require("gulp")

let browserify =require("browserify")
let source = require("vinyl-source-stream")
let tsify = require("tsify");
let watchify = require("watchify")
let gutil = require("gulp-util")

const less = require('gulp-less')

var wathchedBrowerify = watchify(browserify({
    basedir:"",
    debug:true,
    entries:["src/main.ts"],
    cache:{},
    packageCache:{}
})).plugin(tsify)

let paths = {
    pages:["src/*.html"]
}

gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
      .pipe(less())
      .pipe(gulp.dest('dist/css'));
  });

gulp.task("copy-html",function(){
    return gulp.src(paths.pages).pipe(gulp.dest("dist"))
});
function bundle(){
    return wathchedBrowerify.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}
gulp.task("default",gulp.series("copy-html","less",bundle));

gulp.watch(['src/less/*.less','src/index.html'], gulp.series('less','copy-html'));

wathchedBrowerify.on("update",bundle);
wathchedBrowerify.on("log",gutil.log)
