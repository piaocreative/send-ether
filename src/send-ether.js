#!/usr/bin/env node
'use strict'
const _ = require('lodash');
const process = require('process');
const program = require('commander');
const VERSION = require('../package.json').version;
const {sendEther} = require('./lib');

process.on('unhandledRejection', console.error);
program
	.version(VERSION, '-v, --version')
	.arguments('<to> <amount>')
	.option('-u, --units <n>', `decimal places amount is expressed in (default: 18)`, parseInt)
	.option('-k, --key <hex>', `sending wallet's private key`)
	.option('-f, --key-file <file>', `sending wallet's private key file`)
	.option('-s, --keystore-file <file>', `sending wallet's keystore file`)
	.option('--password <password>', `keystore file password`)
	.option('-m, --mnemonic <phrase>', `sending wallet's HD wallet phrase`)
	.option('--mnemonic-index <n>', `sending wallet's HD wallet account index`, parseInt, 0)
	.option('-a, --account <hex>', `sending wallet's account address (provider wallet)`)
	.option('-c, --confirmations <n>', `number of confirmations to wait for before returning`, parseInt, 0)
	.option('-p, --provider <uri>', `provider URI`)
	.option('-n, --network <name>', 'network name')
	.option('-G, --gas-price <gwei>', `explicit gas price, in gwei (e.g., 20)`, parseFloat)
	.option('-l, --log <file>', `append a JSON log to a file`)
	.option('--no-confirm', `prevent confirmation`)
	.action(async function (token, to, amount) {
		try {
			const opts = _.assign({}, this, {confirm: !this.noConfirm});
			const r = await sendEther(token, to, amount, opts);
			process.exit(r ? 0 : -1);
		} catch (err) {
			console.error(err);
			process.exit(-1);
		}
	});
program.parse(process.argv);
if (process.argv.slice(2).length == 0)
	program.outputHelp();
