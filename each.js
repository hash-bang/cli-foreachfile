#!/usr/bin/env node
var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var colors = require('chalk');
var fsPath = require('path');
var glob = require('glob');
var spawn = require('child_process').spawn;

var program = require('commander');
program
	.version(require('./package.json').version)
	.usage('[glob] -- <command>')
	.option('-d, --dry-run', 'Do not run anything, instead show what would be run (inplies `-v`)')
	.option('-p, --parallel [number]', 'Run commands in the specified number of parallel threads')
	.option('-v, --verbose', 'Be verbose')
	.allowUnknownOption(true)
	.parse(process.argv);

// Process command line args {{{
if (program.dryRun) program.verbose = true;

program.glob = program.args.shift();
program.command = program.args;

if (program.rawArgs.indexOf('--') > -1) { // Using 'each [glob] -- [command]' syntax
	program.rawArgs.shift(); // Remove node
	program.rawArgs.shift(); // Remove program name
	if (program.rawArgs.indexOf('--') == 0) { // No glob specified assume 'each * -- command'
		program.glob = '*';
		program.command = program.rawArgs.slice(1);
	}
}

if (!program.glob) {
	console.log('No glob specified.');
	console.log('Usage: foreach [glob] -- <command>');
	return false;
}
if (!program.command.length) {
	console.log('No command specified.');
	console.log('Usage: foreach [glob] -- <command>');
	return false;
}
// }}}

if (program.verbose) console.log(colors.blue('[ForEachFile]'), 'Using glob', colors.cyan(program.glob));

glob(program.glob, {
	follow: true,
	matchBase: true, // Assumme '*.js' -> '**/*.js'
}, function(err, files) {
	if (err) return console.log(colors.blue('[ForEachFile]'), colors.red(err));
	if (!files.length) return console.log(colors.blue('[ForEachFile]'), colors.red('No matching files for the expression'), colors.cyan(program.glob));
	if (program.verbose) console.log(colors.blue('[ForEachFile]'), 'Found', colors.cyan(files.length.toString()), 'files');

	async()
		.limit(program.parallel || 1) // Limit parallel processes
		.forEach(files, function(next, path) {
			var basename = fsPath.basename(path);
			var ext = fsPath.extname(path).replace(/^\./, ''); // Remove '.'
			var nameNoExt = fsPath.basename(path, ext ? '.' + ext : '');
			var dirname = fsPath.dirname(path);
			var fullPath = fsPath.resolve(path);

			var myCommand = program.command.map(function(i) {
				return i
					// File
					.replace('%f', basename)
					.replace('{{name}}', basename)
					.replace('{{base}}', basename)
					.replace('{{basename}}', basename)

					// File Info
					.replace('%b', nameNoExt)
					.replace('%e', ext)
					.replace('{{ext}}', ext)
					.replace('{{nameNoExt}}', ext)

					// Directory
					.replace('%d', dirname)
					.replace('{{dir}}', dirname)
					.replace('{{dirname}}', dirname)

					// Path
					.replace('%p', path)
					.replace('%r', fullPath)
					.replace('{{path}}', path)
					.replace('{{resolved}}', fullPath)
			});
			if (program.verbose) console.log(colors.blue('[ForEachFile]'), 'Run', colors.cyan(myCommand.join(' ')));
			if (program.dryRun) return next();

			async()
				.use(asyncExec)
				.exec(myCommand, {
					cwd: dirname,
					passthru: true,
				})
				.end(next);
		})
		.end(function(err) {
			if (err) return console.log(colors.red(err));
		});
});
