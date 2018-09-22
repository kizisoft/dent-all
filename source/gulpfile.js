const del = require('del');
const gulp = require('gulp');
const util = require('gulp-util');
const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec;
const runSequence = require('run-sequence');
const taskListing = require('gulp-task-listing');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const tscConfig = './server/tsconfig.app.json';
const Consts = {
    tscConfig: './server/tsconfig.app.json',
    distFolder: { server: './dist/server', client: './dist/clie nt' },
    srcFolder: { server: './server', client: './client' },
    baseUrl: 'localhost:4200'
};

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.green(msg[item]));
            }
        }
    } else {
        util.log(util.colors.green(msg));
    }
}

function callback(done, action) {
    return function (err, stdout, stderr) {
        stdout && console.log(stdout);
        stderr && console.log(stderr);
        action && action();
        done(err);
    };
}

// Clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/server/**/*', { force: true });
});

// TypeScript compile
gulp.task('build:S', ['clean'], function (done) {
    log('Building server...');
    exec('tsc -p ' + tscConfig, callback(done, function () {
        gulp.src("server/app/config/*.json")
            .pipe(gulp.dest('dist/server/app/config'));
    }));
});

gulp.task('build:C', function (done) {
    log('Building client...');
    exec('ng build', callback(done));
});

// Watch for changes
gulp.task('watch:S', function () {
    gulp.watch(['server/**/*.ts'], ['build:S']).on('change', function (event) {
        log('File ' + event.path + ' was ' + event.type + ', rebuild server...');
    });
});

gulp.task('reload', function (done) {
    reload();
    done();
});

gulp.task('watch:C', function () {
    browserSync.init({
        proxy: "localhost:4200"
    });

    return gulp.watch(['client/**/*.ts', 'client/**/*.html', 'client/**/*.css'], function () {
        runSequence('build:C', 'reload');
    }).on('change', function (event) {
        log('File ' + event.path + ' was ' + event.type + ', rebuild client...');
    });
});

// Start server and watch for changes
gulp.task('serve', function () {
    return nodemon({ script: 'dist/server/index.js', watch: ['dist/server'], delay: "50", ext: 'js' })
        .on('restart', function () { });
});

gulp.task('start', function (done) {
    runSequence('build:S', 'watch:S', 'build:C', 'watch:C', 'serve', done);
});

// Help
gulp.task('help', taskListing);
gulp.task('default', ['help']);