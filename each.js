#!/usr/bin/env node
var colors = require('chalk');
var exec = require('@momsfriendlydevco/exec');
var fspath = require('path');
var glob = require('globby');
var template = require('@momsfriendlydevco/template');
Promise.allLimit = require('./lib/promise.allLimit');

var program = require('commander');
require('commander-extras');

program
	.version(require('./package.json').version)
	.name('each')
	.usage('[glob] -- <command>')
	.option('-c, --command <string>', 'Explicitally specify the command to run')
	.option('-d, --dir', 'Change into each files directory before executing')
	.option('-n, --dry-run', 'Do not run anything, instead show what would be run -implies `-v`')
	.option('-g, --glob <expr>', 'Explicitally specify the glob to use')
	.option('-l, --log <expr>', 'Log text before each execution', "${colors.blue('[File]')} %r")
	.option('-p, --parallel <number>', 'Specify the number of processes to run in parallel', 1)
	.option('-v, --verbose', 'Be verbose')
	.note('Command arguments and log output can use ES6 templates or simple percentage prefix characters')
	.example("each '**/*' -- echo %f", 'List all basenames from this directory recursively')
	.example("each '**/*.jpg' -- convert %b.jpg %b.png", 'Convert all JPG images into PNG')
	.parse(process.argv);


var evalCommand = (arg, parsed) =>
	template(
		arg
			.replace(/%d/g, parsed.dir)
			.replace(/%e/g, parsed.ext)
			.replace(/%f/g, parsed.base)
			.replace(/%b/g, parsed.base)
			.replace(/%p/g, parsed.full)
			.replace(/%r/g, parsed.relative),
		{
			name: parsed.name,
			base: parsed.base,
			basename: parsed.base,
			ext: parsed.ext,
			dir: parsed.dir,
			dirname: parsed.dir,
			path: parsed.full,
			relative: parsed.relative,
			colors,
			path: fspath,
		}
	);


Promise.resolve()
	// Process command line args / sanity checks {{{
	.then(()=> {
		if (program.dryRun) program.verbose = true;

		if (program.rawArgs.some(a => a == '--')) { // Using 'each [glob] -- [command]' syntax
			program.rawArgs.shift(); // Remove node
			program.rawArgs.shift(); // Remove program name

			var splitAt = program.rawArgs.findIndex(a => a == '--');
			program.glob = program.rawArgs.slice(0, splitAt);
			program.command = program.rawArgs.slice(splitAt + 1);
		}

		if (!program.glob) throw new Error('Cannot determine glob, specify with `-g <glob...>`  or before `--`');
		if (!program.command) throw new Error('Cannot determine command, specify with `-c <command>`  or after `--`');
	})
	// }}}
	// Perform glob {{{
	.then(()=> glob(program.glob))
	.then(paths => paths.length ? paths : Promise.reject('No files found'))
	// }}}
	// ForEach over files {{{
	.then(paths => Promise.allLimit(program.parallel, paths.map(path => ()=> {
		var parsed = {relative: path, full: fspath.resolve(path), ...fspath.parse(path)};

		var fullPath = fspath.resolve(path);
		var pathCommand = program.command.map(c => evalCommand(c, parsed));

		if (program.verbose) console.log(evalCommand(program.log, parsed));

		if (program.dryRun) {
			console.log(colors.gray('[Dry-Run]'), exec.join(pathCommand))
			return Promise.resolve();
		} else {
			return exec(pathCommand, {
				log: true,
				cwd: program.dir ? parsed.dir : process.cwd(),
			});
		}
	})))
	// }}}
	// End {{{
	.then(()=> process.exit(0))
	.catch(e => {
		console.warn(colors.red('ERROR'), e.toString());
		process.exit(1);
	})
	// }}}
