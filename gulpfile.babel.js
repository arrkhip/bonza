"use strict";

import gulp from 'gulp';
import plumber from "gulp-plumber"
import postCSS from "gulp-postcss"
import stylus from "gulp-stylus"
import sourceMaps from "gulp-sourcemaps"
import rupture from "rupture"
import autoprefixer from "autoprefixer"
import cssNano from "cssnano"
import rename from "gulp-rename"
import short from "postcss-short"
import concat from "gulp-concat"
import replace from "gulp-replace"
import assets from "postcss-assets"

import pug from "gulp-pug"

import stylelint from "stylelint"
import stylelintConfig from "./stylelint.config"
import reporter from "postcss-browser-reporter"

import terser from "gulp-terser"

import imgMin from "gulp-imagemin"
import cheerio from "gulp-cheerio"
import svgSprite from "gulp-svg-sprite"
import svgMin from "gulp-svgmin"

import zip from "gulp-zip"
import del from "del"
import ftp from "gulp-ftp"

import browserSync from "browser-sync"

const path = {
    app: {
        html: "./app/pug/pages/**/*.pug",
        css: "./app/style/main.styl",
        js: "./app/js/common.js",
        img: "./app/img/**/*.+(jpg|jpeg|png|gif|ico)",
        svg: "./app/img/svg/*.svg",
        fonts: "./app/fonts/**/*.+(ttf|eot|woff|svg)"
    },
    libs: {
        css: [
            "./app/libs/bootstrap4/dist/css/bootstrap-grid.min.css",
            "./app/libs/normalize.css/normalize.css",
            "./app/libs/fancybox/dist/jquery.fancybox.min.css",
            "./app/libs/swiper/dist/css/swiper.min.css"
        ],
        js: [
            "./app/libs/jquery/dist/jquery.slim.min.js",
            "./app/libs/fancybox/dist/jquery.fancybox.min.js",
            "./app/libs/swiper/dist/js/swiper.min.js",
            "./app/libs/svg4everybody/dist/svg4everybody.min.js"
        ]
    },
    dest: {
        html: "./build/",
        css: "./build/css/",
        js: "./build/js/",
        img: "./build/img/",
        svg: "./build/img/",
        fonts: "./build/fonts/"
    },
    watch: {
        html: "./app/pug/**/*.pug",
        css: "app/style/**/*.styl",
        js: "app/js/common.js",
        img: "app/img/**/*.+(jpg|jpeg|png|gif|ico)",
        svg: "app/img/svg/*.svg",
        fonts: "./app/fonts/**/*"
    }
}


export function browserSyncs() {
    return browserSync({
        server: {
            baseDir: "./build/"
        },
        notify: false,
        open: false,
        // tunnel: true, tunnel: "project-name", 
        // Demonstration page: http://project-name.localtunnel.me
    });
}


export function loadToServer() {
    return gulp.src('./build/*')
        .pipe(ftp({
            host: 'site.com',
            user: 'login',
            pass: '1234'
        }))
}


export function html() {
    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dest.html))
        .pipe(browserSync.stream())
}


export function styles() {

    let postCSSPlugins = [
        stylelint(stylelintConfig),
        short(),
        autoprefixer({
            browsers: ['last 4 version']
        }),
        assets({
            loadPaths: ["build/img/"],
            relative: "build/css"
        }),
        cssNano({
            discardUnused: {
                fontFace: false
            }
        }),
        reporter()
    ];

    return gulp.src(path.app.css)
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(stylus({
            use: [rupture()]
        }))
        .pipe(postCSS(postCSSPlugins))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(path.dest.css))
        .pipe(browserSync.stream())
}


export function vendorCss() {
    return gulp.src(path.libs.css)
        .pipe(concat('vendor.min.css'))
        .pipe(sourceMaps.init())
        .pipe(postCSS([cssNano()]))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(path.dest.css))
}


export function minJs() {
    return gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(terser())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.dest.js))
        .pipe(browserSync.stream())
}


export function vendorMinJs() {
    return gulp.src(path.libs.js)
        .pipe(concat('vendor.min.js'))
        .pipe(terser())
        .pipe(gulp.dest(path.dest.js))
}


export function imageMin() {
    return gulp.src(path.app.img)
        .pipe(imgMin())
        .pipe(gulp.dest(path.dest.img))
}


export function svgSprites() {
    return gulp.src(path.app.svg)
        .pipe(svgMin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $("[fill]").removeAttr("fill");
                $("[stroke]").removeAttr("stroke");
                $("[style]").removeAttr("style");
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace("&gt;", ">"))
        .pipe(svgSprite({
            mode: {
                inline: true,
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(path.dest.svg));
}


export function fonts() {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dest.fonts))
}


export function zipFile() {
    return gulp.src('./build/**')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
}


function watchPlugins() {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.css, styles);
    gulp.watch(path.watch.js, minJs);
    gulp.watch(path.watch.img, imageMin);
    gulp.watch(path.watch.svg, svgSprites);
    gulp.watch(path.watch.fonts, fonts);
}


export {
    watchPlugins as watch
};


const build = gulp.series(gulp.parallel(browserSyncs,
    html,
    styles,
    vendorCss,
    minJs,
    vendorMinJs,
    imageMin,
    svgSprites,
    fonts,
    watchPlugins
));

export const clean = () => del('./build');

export default build;