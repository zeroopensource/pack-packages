import * as fse from 'fs-extra'
import packagejson from './../package.json'
import * as path from 'node:path'

type WriteNpmrcOptions = {
	/** output path for .npmrc i.e. packages/mypackage */
	outputPath: string
	/** registry to be used i.e. https://npm.pkg.github.com, https://registry.npmjs.org */
	registryUrl: string
	/** name of env variable for authToken i.e. NPM_TOKEN, GITHUB_TOKEN */
	authTokenEnvName: string
	/** array of package scopes i.e. [\@username, \@org] */
	scopes: string[]
}

/**
 * 	Write .npmrc
 *	@param opts.outputPath - output path for .npmrc i.e. packages/mypackage
 *	@param opts.registryUrl - registry to be used i.e. https://npm.pkg.github.com, https://registry.npmjs.org
 * 	@param opts.authTokenEnvName - name of env variable for authToken i.e. NPM_TOKEN, GITHUB_TOKEN
 * 	@param opts.scopes - array of package scopes i.e. [\@username, \@org]
 * 	@returns Promise from fs-extra
 */
export const writeNpmrc = ({
	outputPath,
	registryUrl,
	scopes,
	authTokenEnvName,
}: WriteNpmrcOptions) => {
	// TODO: Publish and use standard log package
	// TODO: Check if env variable exists, if not warn

	const { host: registryHost } = new URL(registryUrl)

	const parsedScopes = scopes
		.map(scope => `${scope}:registry=${registryUrl}`)
		.join('\n\t\t')

	const data = `
	# [${packagejson.name}][start] Set registry, remove after use
		${parsedScopes}
		//${registryHost}/:_authToken=\${${authTokenEnvName}}
	# [${packagejson.name}][end] Set registry
`

	return Promise.all([
		fse.outputFile(path.join(outputPath, '.npmrc'), data),
		fse.outputFile(path.join(outputPath, 'package.json'), ''),
	])
}
