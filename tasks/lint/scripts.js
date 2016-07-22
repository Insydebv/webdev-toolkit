// Lint script
module.exports = {
	fn: function (gulp, plugins, options, callback) {
		return gulp.src([options.paths.scriptSrc, options.paths.headScriptSrc, options.paths.pageScriptSrc])
        	.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter(plugins.jshintStylish))
        ;
	}
};