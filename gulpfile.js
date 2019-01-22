const gulp = require("gulp")
const browserify =require("browserify")
const source = require("vinyl-source-stream")
const tsify = require("tsify");
const watchify = require("watchify")
const gutil = require("gulp-util")
const less = require('gulp-less')
const wathchedBrowerify = watchify(browserify({
    basedir:"",
    debug:true,
    entries:["src/ts/main.ts"],
    cache:{},
    packageCache:{}
})).plugin(tsify)

gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(less()).pipe(gulp.dest('dist/css'));
});
gulp.task("copy-html",function(){
    return gulp.src(["src/*.html"]).pipe(gulp.dest("dist"))
});
function bundle(){
    console.info("budler.............")
    return wathchedBrowerify.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}
gulp.task("default",gulp.series("copy-html","less",bundle));
gulp.watch(['src/less/*.less','src/index.html'], gulp.series('less','copy-html'));

wathchedBrowerify.on("update",bundle);
wathchedBrowerify.on("log",gutil.log)
