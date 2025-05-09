import { z } from 'zod'
import packagejson from './../package.json'

// TODO: Move to zero-gists
export const findClosingBracket = (str: string, pos: any) => {
	const squareRExp = /[\[\]]/g
	// const parenthesesRExp = /\(|\)/g
	const rExp = squareRExp
	rExp.lastIndex = pos + 1
	var deep = 1
	while ((pos = rExp.exec(str))) {
		if (!(deep += str[pos.index] === '(' ? 1 : -1)) {
			return pos.index
		}
	}
}

export const packageGroupZod = z.object({
	packages: z.string().array(),
	registryUrl: z.string().url(),
	authTokenEnvName: z.string(),
})

export type PackageGroupType = z.infer<typeof packageGroupZod> | string

export type ValidPackageGroupType = z.infer<typeof packageGroupZod>

export const validatePackageGroup = (
	packageGroup: any,
): packageGroup is ValidPackageGroupType =>
	packageGroupZod.safeParse(packageGroup).success

export const parsePackageGroupString = (
	packageGroupString: string,
	packageGroupIndex: number,
) => {
	try {
		const [packages, [registryUrl, authTokenEnvName]] = packageGroupString
			.replace(/\s+/g, '')
			.split(/[\[\]]+/)
			.filter(Boolean)
			.map(z => z.split(',').filter(Boolean))

		return {
			packages,
			registryUrl,
			authTokenEnvName,
		}
	} catch (error) {
		console.error(
			`[${packagejson.name}] Failed to parse PackageGroupString[${packageGroupIndex}]`,
		)
		return packageGroupString
	}
}

export const parsePackageGroup = (
	packageGroup: PackageGroupType,
	packageGroupIndex: number,
) =>
	typeof packageGroup === 'string'
		? parsePackageGroupString(packageGroup, packageGroupIndex)
		: packageGroup
