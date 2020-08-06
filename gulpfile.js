//1.导入各种包(模块)
const gulp = require('gulp');
const html = require('gulp-minify-html'); //压缩html
const css = require('gulp-clean-css'); //压缩css

// 导入sass
const sass = require('gulp-sass'); //引入sass编译插件 
const sourcemaps = require('gulp-sourcemaps'); //引入生成.map文件模块
const plugins = require('gulp-load-plugins')(); //生成.map文件 返回的是一个函数体。需要再次执行。

//javascript
const script = require('gulp-uglify'); //压缩js的插件

//es6转es5的三个模块
//gulp-babel@7   babel-core       babel-preset-es2015
const babel = require('gulp-babel'); //主要
const babelcore = require('babel-core');
const es2015 = require('babel-preset-es2015');

//图片压缩
const imagemin = require('gulp-imagemin');

const watch = require('gulp-watch');

//2.复制 ---- 无需插件
gulp.task('copyfile', function() {
    return gulp.src('src/font/*').pipe(gulp.dest('dist/font/'))
})


//3.压缩html
gulp.task('uglifyhtml', function() {
    return gulp.src('src/*.html')
        .pipe(html())
        .pipe(gulp.dest('dist/'))
});
//4.压缩css
gulp.task('uglifycss', function() {
    return gulp.src('src/css/*.css')
        .pipe(css())
        .pipe(gulp.dest('dist/css/'))
});


//5.编译sass
gulp.task('compilesass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(plugins.sourcemaps.init()) //初始化gulp-sourcemaps插件
        .pipe(plugins.sass({
            outputStyle: 'compressed' //压缩
        }))
        .pipe(plugins.sourcemaps.write('.')) //通过sourcemaps,生成.map文件
        .pipe(gulp.dest('dist/css/'));
});

//6.压缩js
gulp.task('uglifyjs', function() {
    return gulp.src('src/script/*.js')
        .pipe(babel({ //先将es6转换成es5
            presets: ['es2015'] //es2015->es6  es2016->es7...
        }))
        .pipe(script())
        .pipe(gulp.dest('dist/script/'))
})

//7.图片压缩 - jpg/gif/bmp/webp/ [png] - imagemin
gulp.task('uglifyimg', function() {
    return gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'))
});

//8.监听
// 监听插件-gulp-watch()
// 参1:监听的目录，数组的形式
// 参2:通过gulp.parallel()并行监听任务名。
// 监听的任务必须先执行一次，再能进行监听。
gulp.task('default', function() { //default默认的任务名。
    watch(['src/*.html', 'src/css/*.css', 'src/script/*.js'], gulp.parallel('uglifyhtml', 'uglifycss', 'uglifyjs'));
});