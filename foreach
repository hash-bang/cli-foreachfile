#!/usr/bin/env node
var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var colors = require('colors');
var fsPath = require('path');
var glob = require('glob');
var spawn = require('child_process').spawn;

var program = require('commander');
program
	.version(require('./package.json').version)
	.usage('[files...] -- <command>')
	.option('-d, --dry-run', 'Do not run anything, instead show what would be run (inplies `-v`)')
	.option('-l, --limit [number]', 'Number of commands to run in parallel if `-p` is set')
	.option('-p, --parallel', 'Run all commands in parallel')
	.option('-v, --verbose', 'Be verbose')
	.parse(process.argv);

// Process command line args {{{
if (program.dryRun) program.verbose = true;

var cmdstart = program.rawArgs.indexOf('--');
if (!cmdstart) {
	console.log('Command must be specified after `--`');
	console.log('Usage: foreach [patterns...] -- <command>');
	return false;
}
program.command = program.rawArgs.splice(cmdstart).slice(1);

if (!program.command) {
	console.log('No command specified.');
	console.log('Usage: foreach [patterns...] -- <command>');
	return false;
}

program.glob = program.rawArgs.pop();
if (!program.glob) program.glob = '**';
// }}}

console.log('GLOB', program.glob);
console.log('CMD', program.command);


glob(program.glob, {
	follow: true,
}, function(err, files) {
	async()
		.limit(program.parallel ? 1 : program.limit) // Limit parallel processes
		.forEach(files, function(next, path) {
			var basename = fsPath.basename(path);
			var ext = fsPath.extname(path).replace(/^\./, ''); // Remove '.'
			var nameNoExt = fsPath.basename(path, ext ? '.' + ext : '');
			var dirname = fsPath.dirname(path);
			var myCommand = program.command.map(function(i) {
				return i
					.replace('%b', nameNoExt)
					.replace('%e', ext)
					.replace('%f', basename)
					.replace('%p', path)
					.replace('{{name}}', basename)
					.replace('{{path}}', path)
					.replace('{{dir}}', dirname)
					.replace('{{base}}', basename)
					.replace('{{basename}}', basename)
					.replace('{{ext}}', ext)
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
