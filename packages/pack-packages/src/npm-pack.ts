import { execa } from '@esm2cjs/execa'

type OptionsType = {
	cwd: string
	packages: string[]
}

export const npmPack = ({ cwd, packages }: OptionsType) =>
	execa('npm', ['pack', ...packages, '--pack-destination=./../'], {
		cwd,
	})
