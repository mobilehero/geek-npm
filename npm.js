var _ = require("lodash");
var spawn = require("@geek/spawn");

var npm = {};
module.exports = npm;

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

	// console.error('pkgs: ' + JSON.stringify(pkgs, null, 2));

	var execArgs = ["install"];
	var execOpts = {};

	// if (opts.cwd) {
	// 	execOpts.cwd = opts.cwd;
	// }


	if (_.isString(pkgs)) {
		pkgs = [pkgs];
	} else if( !_.isArray(pkgs) && _.isObject(pkgs)){
		opts = pkgs;
		pkgs = [];
	}

	opts = opts ? _.clone(opts) : {};
	execArgs = execArgs.concat(pkgs);

	console.error('pkgs: ' + JSON.stringify(pkgs, null, 2));
	console.error('execArgs: ' + JSON.stringify(execArgs, null, 2));

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

	delete opts.sync;
	delete opts.global;
	delete opts.save;
	delete opts.saveDev;
	delete opts.registry;

	_.defaults(execOpts, opts);
	// process.stdout.write("Executing npm " + execArgs.join(" "));
	console.error("Executing npm " + execArgs.join(" "));
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
	opts = opts || {};
	var sync = opts.sync ? "sync" : "async";
	console.error("Executing npm dedupe...");
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
	opts = opts || {};
	opts.sync = true;
	return npm.dedupe(opts);
};