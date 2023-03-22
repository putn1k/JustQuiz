import gulp from 'gulp';
import {
  deleteAsync
} from 'del';
import gulpIf from 'gulp-if';
import notify from 'gulp-notify';
import bs from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import csscomb from 'gulp-csscomb';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import babel from 'gulp-babel';

const PLUGIN_NAME = 'just-quiz';
let isProd = false;
const {
  src,
  dest,
  series,
  parallel,
  watch
} = gulp;
const sass = gulpSass( dartSass );
const browserSync = bs.create();
const Path = {
  Src: './src/',
  Dist: './dist/',
  Build: './build/',
};

const cleanBuildFolder = () => deleteAsync( [ `${Path.Build}*` ] );

const toProd = ( done ) => {
  isProd = true;
  done();
};

const getHTML = () => {
  return src( [ `${Path.Src}index.html` ] )
    .pipe( dest( Path.Build ) )
    .pipe( gulpIf( !isProd, browserSync.stream() ) );
};

const getStyles = () => {
  return src( `${Path.Src}style.scss` )
    .pipe( sass().on( "error", notify.onError() ) )
    .pipe( postcss( [
      autoprefixer( {
        cascade: false,
      } )
    ] ) )
    .pipe( dest( `${Path.Build}` ) )
    .pipe( gulpIf( isProd, csscomb() ) )
    .pipe( gulpIf( isProd, cleanCSS( {
      level: 2
    } ) ) )
    .pipe( gulpIf( isProd, rename( `${PLUGIN_NAME}.min.css` ) ) )
    .pipe( gulpIf( isProd, dest( `${Path.Dist}` ) ) )
    .pipe( gulpIf( !isProd, browserSync.stream() ) );
};

const getScripts = () => {
  return src( `${Path.Src}script.js` )
    .pipe( babel( {
      presets: [ '@babel/env' ]
    } ) )
    .pipe( dest( `${Path.Build}` ) )
    .pipe( gulpIf( isProd, terser() ) )
    .pipe( gulpIf( isProd, rename( `${PLUGIN_NAME}.min.js` ) ) )
    .pipe( gulpIf( isProd, dest( `${Path.Dist}` ) ) )
    .pipe( gulpIf( !isProd, browserSync.stream() ) );
}

const watchFiles = () => {
  browserSync.init( {
    server: {
      baseDir: `${Path.Build}`
    },
    notify: false,
    ui: false,
  } );

  watch( `${Path.Src}index.html`, getHTML );
  watch( `${Path.Src}**/*.scss`, getStyles );
  watch( `${Path.Src}script.js`, getScripts );
}

const processBuild = parallel(
  getHTML,
  getStyles,
  getScripts
)

const startDevelopment = series(
  cleanBuildFolder,
  processBuild,
  watchFiles
);

const buildProduction = series(
  toProd,
  cleanBuildFolder,
  processBuild
);

export default startDevelopment;
export {
  cleanBuildFolder as clean,
  buildProduction as build
};
