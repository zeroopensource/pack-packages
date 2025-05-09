import packagejson from './../package.json'
import { PackageGroupType } from './package-group'
import * as fse from 'fs-extra'
import { packPackageGroup } from './pack-package-group'

export type PackPackagesOptions = {
	/**
	 * @param array - array of PackageGroup or PackageGroupString
	 * @param PackageGroup.packages - array of packages i.e. \@zero-company/zero-ui, tailwindcss
	 * @param PackageGroup.registryUrl - url of registry i.e. https://npm.pkg.github.com, https://registry.npmjs.org
	 * @param PackageGroup.authTokenEnvName - name of env variable for authToken i.e. NPM_TOKEN, GITHUB_TOKEN
	 * @example PackageGroupString
	 * '[@zero-company/zero-ui,tailwindcss],https://npm.pkg.github.com,ZERO_READONLY_GITHUB_TOKEN'
	 * @example PackageGroup
	 * ```
	 * {
	 * 	packages: ['@zero-company/zero-ui@1.0.0', 'tailwindcss'],
	 * 	registryUrl: 'https://npm.pkg.github.com',
	 * 	authTokenEnvName: 'ZERO_READONLY_GITHUB_TOKEN',
	 * }
	 * ```
	 */
	packageGroups: PackageGroupType[]
	/** keep cached PackageGroup directory */
	cleanup?: boolean
}

/**
 	Pack packages in tgz
	@param {array} opts.packageGroups - array of PackageGroups
 	@param opts.cleanup - keep cached PackageGroup directory
 */
export const packPackages = ({
	packageGroups,
	cleanup,
}: PackPackagesOptions) => {
	const cacheDirectory = `node_modules/.cache/zero/pack-packages`
	return fse
		.remove(cacheDirectory)
		.then(() =>
			Promise.all(
				packageGroups.map((packageGroup, index) =>
					packPackageGroup({
						packageGroup,
						index,
						cacheDirectory,
						cleanup,
					}),
				),
			),
		)
		.then(res => {
			console.log(`[${packagejson.name}] Finished packing`)
			return res
		})
}
