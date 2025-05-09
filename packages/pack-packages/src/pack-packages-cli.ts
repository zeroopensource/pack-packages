#!/usr/bin/env node

import { packPackages } from './pack-packages'
import { program } from 'commander'
import packagejson from './../package.json'

program
	.name(Object.keys(packagejson.bin)[0] || 'undefined')
	.version(packagejson.version || 'undefined', '--version')
	.description(
		`${packagejson.name}@${packagejson.version}: Pack packages in tgz`,
	)
	.usage(
		`'[@zero-company/zero-ui,tailwindcss],https://npm.pkg.github.com,ZERO_READONLY_GITHUB_TOKEN'`,
	)
	.option('--nocleanup', 'keep cached PackageGroup directory')
	.parse(process.argv)

const packageGroups = program.args.map(
	packageGroup => packageGroup.replace(/['"`]+/g, ''), // Fix quoted args
)
const opts = program.opts()

if (!packageGroups.length) {
	console.log(`[${packagejson.name}] Need to provide at least one PackageGroup`)
	process.exit(1)
}

packPackages({
	packageGroups,
	cleanup: !opts.nocleanup,
})
