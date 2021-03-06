'use strict';
const plugins = require('./libs/plugins');
const rcfile = require("rc-config-loader");
let options = {};

module.exports = (gulp) => {

  // Assign options
  const defaultOptions = require(__dirname + '/defaultconfig.json');
  const config = rcfile('webdevtoolkit', {
    packageJSON: true,
  });

  if(config) {
    console.log(`Using config ${config.filePath}`);
    options = Object.assign(defaultOptions, config.config);
  }
  else {
    process.on('exit', (code) => {
      console.error(`ERROR: Could not load config. Make sure you have a valid configuration:
- .webdevtoolkitrc in the root of your project
- webdevtoolkit key in package.json
      `);
    });
    process.exit(1);
  }

  // Load tasks

  // Npm tasks
  const npmAssets = require('./tasks/npm/assets')(gulp, options);
  gulp.task("npm:assets", npmAssets);
  const npmStyles = require('./tasks/npm/styles')(gulp, options);
  gulp.task("npm:styles", npmStyles);
  gulp.task('npm:build', gulp.series('npm:assets', 'npm:styles'));

  // Clean
  const cleanNpm = require('./tasks/clean/npm')(gulp, options);
  gulp.task('clean:npm', cleanNpm);
  const cleanFonts = require('./tasks/clean/fonts')(gulp, options);
  gulp.task('clean:fonts', cleanFonts);
  const cleanImages = require('./tasks/clean/images')(gulp, options);
  gulp.task('clean:images', cleanImages);
  const cleanScripts = require('./tasks/clean/scripts')(gulp, options);
  gulp.task('clean:scripts', cleanScripts);
  const cleanStyles = require('./tasks/clean/styles')(gulp, options);
  gulp.task('clean:styles', cleanStyles);
  gulp.task('clean:all', gulp.series('clean:npm', 'clean:fonts', 'clean:images', 'clean:scripts', 'clean:styles'));

  // Fonts
  const fontsBuild = require('./tasks/fonts/build')(gulp, options);
  gulp.task('fonts:build', fontsBuild);

  // Images
  const imagesImagemin = require('./tasks/images/imagemin')(gulp, options);
  gulp.task('images:imagemin', imagesImagemin);

  // Lint
  const lintScripts = require('./tasks/lint/scripts')(gulp, options);
  gulp.task('lint:scripts', lintScripts);
  const lintStyles = require('./tasks/lint/styles')(gulp, options);
  gulp.task('lint:styles', lintStyles);

  // Scripts
  const scriptsStealBuild = require('./tasks/steal/build')(gulp, options);
  gulp.task('steal:build', scriptsStealBuild);
  gulp.task('scripts:build', gulp.series('lint:scripts', 'steal:build'));

  // Styles
  const stylesSassIndex = require('./tasks/styles/sass-index')(gulp, options);
  gulp.task('styles:sass-index', stylesSassIndex);
  const stylesSass = require('./tasks/styles/sass')(gulp, options);
  gulp.task('styles:sass', stylesSass);
  gulp.task('styles:build', gulp.series('lint:styles', 'styles:sass-index', 'styles:sass'));

  // Utilities
  const utilitiesBrowserSync = require('./tasks/utilities/browser-sync')(gulp, options);
  gulp.task('utilities:browser-sync', utilitiesBrowserSync);
  const utilitiesWatch = require('./tasks/utilities/watch')(gulp, options);
  gulp.task('utilities:watch', utilitiesWatch);

  // Combined tasks:
  // Build
  gulp.task('build',  gulp.series('clean:all', 'npm:build', 'styles:build', gulp.series('fonts:build', 'images:imagemin', 'scripts:build')));

  // Default
  gulp.task('default', gulp.series('build', 'utilities:watch', 'utilities:browser-sync'));

  // Test
  gulp.task('test', gulp.series('lint:scripts', 'lint:styles'));

  return options;
};
