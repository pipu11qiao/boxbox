/**
 * Created by Administrator on 2017/7/27.
 */
// 将项目中个模块的js和css合并到一起
var gulp = require('gulp');
var concat = require('gulp-concat'); // 文件合并
var uglify = require('gulp-uglify'); // js压缩
var minify = require('gulp-minify-css'); // css-prev 压缩
var rename = require('gulp-rename'); // 重命名
var del = require('del'); // 删除

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var connect = require('gulp-connect');
var sequence = require('gulp-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
//--------------------------------------- develop --------------------------------
var DEST = 'dist/customView'; // 文件路径
var CSSPATH = DEST + '/css'; // css文件路径
var JSPATH = DEST + '/js'; // js 文件路径

//-------------------------- develop   编译Customview.js

var pluginPath = 'develop/plugin/'; // 项目用到的插件路径
// 合并插件 js
gulp.task('jsPlugin', function () {
    var version = require('./package.json').version;
    return gulp
        .src([
            pluginPath + 'bootstrap/js/bootstrap.min.js',
            pluginPath + 'swiper/js/swiper.jquery.min.js',
            pluginPath + 'jquery.mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js',
            pluginPath + 'jQuery-ajaxTransport-XDomainRequest-master/jQuery.XdomainRequest.js',
            pluginPath + 'jquery-qrcode-master/jquery.qrcode.min.js'
        ])
        .pipe(concat("customViewPlugin-" + version + ".js"))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('develop/common/js'));
});

// 合并插件 css-prev
gulp.task('cssPlugin', function () {
    var version = require('./package.json').version;
    return gulp
        .src([
            pluginPath + 'bootstrap/css-prev/bootstrap.min.css',
            pluginPath + 'swiper/css-prev/swiper.min.css',
            pluginPath + 'jquery.mCustomScrollbar/jquery.mCustomScrollbar.min.css',
        ])
        .pipe(concat('customViewPlugin-' + version + '.css'))
        .pipe(minify())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('develop/common/css-prev/'));
});
// 合并插件的js和css
gulp.task('plugin',['jsPlugin','cssPlugin']);

// 本地热加载
gulp.task('reload',function () {
    gulp.src('develop/*.html')
        .pipe(connect.reload());
});
// 本地监视文件
gulp.task('watch',function () {
    gulp.watch(['develop/customView/css/*.css','develop/customView/js/*.js','develop/common/js/page.js','develop/common/js/test-page.js'],['reload']);
});
// 本地服务器
gulp.task('server',['sass'],function () {
    connect.server({
        root: './',
        port: 8080,
        livereload: true
    });
});
// 本地开发任务
gulp.task('dev',['server','watch']);
// develop 生产 -----------------------------------------------------

// 清楚原来dist中的文件
gulp.task('clean',function (cb) {
     del(['dist/**/*']).then(function () {
        cb();
    });
});
// 将common和src文件移动到dist文件夹
gulp.task('move1',function () {
 return  gulp.src('develop/common/**/*').pipe(gulp.dest('dist/common'));
});
gulp.task('move2',function () {
    return gulp.src('develop/src/**/*').pipe(gulp.dest('dist/src'));
});

// 合并压缩css并生成hash文件
gulp.task('css',function () {
    return gulp.src([
            'develop/customView/css/customView.css'
        ])
        .pipe(postcss([ autoprefixer({
            // browserslist: [ "> 5%", "last 2 versions","ie 9"]
        }) ]))
        .pipe(gulp.dest(CSSPATH))
        .pipe(minify())
        .pipe(rev())
        .pipe(gulp.dest(CSSPATH))
        .pipe(rev.manifest())
        .pipe(gulp.dest(CSSPATH));
});
// 合并压缩js并生成hash文件
gulp.task('js',function () {
    return gulp
        .src([
            'develop/customView/js/definePRODUTION.js',
            'develop/customView/js/customViewFirst.js',
            'develop/customView/js/addCSSAndAddHtml.js',// 中间模块
            'develop/customView/js/showingView.js',// 中间模块
            'develop/customView/js/optionView.js',// 中间模块
            'develop/customView/js/btnView.js',// 中间模块
            'develop/customView/js/shareView.js',// 中间模块
            'develop/customView/js/shoppingList.js', // 中间模块
            'develop/customView/js/customViewLast.js',// 最后模块
            'develop/customView/js/buried.js' // 埋点模块
        ])
        .pipe(concat("customView.js"))
        .pipe(gulp.dest(JSPATH))
        .pipe(uglify()) // 压缩
        .pipe(rev()) // - 文件名加MD5后缀
        .pipe(gulp.dest(JSPATH))         //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest(JSPATH)); //- 将 rev-manifest.json 保存到 rev 目录内

});
// 查找hash路径并进行替换

gulp.task('html',function () {
    return gulp.src(['dist/customView/**/*.json','develop/template/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist/'));
});
// 添加sass功能

gulp.task('compileSass',function () {
   return gulp.src('develop/customView/sass/customView.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error',sass.logError))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest('develop/customView/css'));
});

gulp.task('watchsass',function () {
   gulp.watch('develop/customView/sass/**/*.scss',['compileSass']);
});
gulp.task('sass',['compileSass','watchsass']);

gulp.task('build',sequence('clean','move1','move2','css','js','html'));
