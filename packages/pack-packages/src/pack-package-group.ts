import {
	PackageGroupType,
	parsePackageGroup,
	validatePackageGroup,
} from './package-group'
import { writeNpmrc } from './write-npmrc'
import { npmPack } from './npm-pack'
import * as path from 'node:path'
import * as fse from 'fs-extra'
import packagejson from './../package.json'

export const packPackageGroup = ({
	packageGroup,
	index,
	cacheDirectory,
	cleanup = true,
}: {
	packageGroup: PackageGroupType
	index: number
	cacheDirectory: string
	cleanup?: boolean
}) =>
	new Promise<void>((resolve, reject) => {
		const parsedPackageGroup = parsePackageGroup(packageGroup, index)

		if (validatePackageGroup(parsedPackageGroup)) {
			const { packages, registryUrl, authTokenEnvName } = parsedPackageGroup
			const scopes = packages
				.filter(el => el.startsWith('@'))
				.map(el => el.split('/')[0])
			const cwd = path.join(cacheDirectory, `package-group-${index}`)

			writeNpmrc({
				outputPath: cwd,
				registryUrl,
				scopes,
				authTokenEnvName,
			})
				.then(() => npmPack({ cwd, packages }))
				.then(() => {
					cleanup && fse.remove(cwd)
				})
				.then(() => resolve())
		} else {
			reject(`[${packagejson.name}] Failed to pack PackageGroup[${index}]`)
		}
	}).catch(error => {
		console.log(error)
	})
