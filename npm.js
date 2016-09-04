'use strict';

var _ = require("lodash");
var spawn = require("@geek/spawn");
var path = require("path");
var npm = {};
module.exports = npm;
const module_name = path.parse(module.id).name;
const chalk = require("chalk");

// debug logger
var logger = (func_name) => {
	var prefix = func_name ? `[${module_name}.${func_name}] ` : `[${module_name}`;
	return _.wrap(require('debug')('geek-npm'), (func, msg) => func(chalk.blue(`[${module_name}.execute] `) + msg));
}
let debug = logger();

/**
 * Run `npm install`
 *
 * @see https://docs.npmjs.com/cli/install
 *
 * @param {string|Array.<string>}   [pkgs]
 * @param {Object}                  [opts]
 *
 */
npm.install = function(pkgs, opts) {
	let debug = logger('install');
	var execArgs = ["install"];
	var execOpts = {};

	// if (opts.cwd) {
	// 	execOpts.cwd = opts.cwd;
	// }

	if (_.isString(pkgs)) {
		pkgs = [pkgs];
	} else if (!_.isArray(pkgs) && _.isObject(pkgs)) {
		opts = pkgs;
		pkgs = [];
	}

	opts = opts ? _.clone(opts) : {};
	execArgs = execArgs.concat(pkgs);

	// console.info('pkgs: ' + JSON.stringify(pkgs, null, 2));
	// console.info('execArgs: ' + JSON.stringify(execArgs, null, 2));

	var sync = opts.sync ? "spawnSync" : "spawn";

	if (opts.global) {
		execArgs.push('-g');
	}

	if (opts.save) {
		execArgs.push('--save');
	}

	if (opts.saveDev) {
		execArgs.push('--save-dev');
	}

	if (opts.registry) {
		execArgs.push('--registry=' + opts.registry);
	}

	if (opts.silent) {
		execOpts.stdio = 'ignore';
	}

	delete opts.sync;
	delete opts.global;
	delete opts.save;
	delete opts.saveDev;
	delete opts.registry;
	delete opts.silent;

	_.defaults(execOpts, opts);
	// process.stdout.write("Executing npm " + execArgs.join(" "));
	debug("Executing: npm " + execArgs.join(" "));
	return spawn[sync]("npm", execArgs, execOpts);
};


/**
 * Run `npm install` synchronously 
 *
 * @see https://docs.npmjs.com/cli/install
 *
 * @param {string|Array.<string>}   [pkgs]
 * @param {Object}                  [opts]
 *
 */
npm.installSync = function(pkgs, opts) {
	opts = opts || {};
	opts.sync = true;
	return npm.install(pkgs, opts);
};

/**
 * Run `npm dedupe`
 *
 * @see https://docs.npmjs.com/cli/dedupe
 *
 * @param {Object}                  [opts]
 */
npm.dedupe = function(opts) {
	let debug = logger('dedupe');
	opts = opts || {};
	var sync = opts.sync ? "spawnSync" : "spawn";
	debug("Executing: npm dedupe");
	return spawn[sync]("npm", ["dedupe"], opts);
};

/**
 * Run `npm dedupe`
 *
 * @see https://docs.npmjs.com/cli/dedupe
 *
 * @param {Object}                  [opts]
 */
npm.dedupeSync = function(opts) {
	let debug = logger('dedupeSync');
	opts = opts || {};
	opts.sync = true;
	return npm.dedupe(opts);
};