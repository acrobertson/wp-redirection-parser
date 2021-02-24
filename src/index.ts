import chalk from 'chalk'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

import type { RedirectsExport } from 'types'

async function main() {
	try {
		const { redirectsFile, baseUrl } = await getArgs()

		// create output file & stream
		try {
			if (!fs.existsSync('out')) {
				fs.mkdirSync('out')
			}

			fs.writeFileSync('out/redirects.txt', '')
		} catch (err) {
			console.error(err)
			return
		}

		const writeStream = fs.createWriteStream('./out/redirects.txt')

		// read input data
		const data: RedirectsExport = JSON.parse(
			fs.readFileSync(redirectsFile, { encoding: 'utf-8' })
		)

		// transform redirects. desired format:
		// Redirect 301 ^/orig/path/?$ https://example.com/new-path
		const redirectsRewritten = data.redirects.map(async (redirect) =>
			redirect.regex
				? `Redirect ${redirect.action_code} ^${redirect.url} ${
						baseUrl + redirect.action_data.url
				  }`
				: `Redirect ${redirect.action_code} ^${
						redirect.url + (redirect.url.slice(-1) === '/' ? '?$' : '/?$')
				  } ${baseUrl + redirect.action_data.url}`
		)

		// write transformed redirects to output file
		for (const redirect of redirectsRewritten) {
			writeStream.write((await redirect) + '\n')
			console.log(await redirect)
		}

		console.log(chalk.green('Saved rewritten redirects to out/redirects.txt'))
	} catch (err) {
		console.log(chalk.red(`Error: ${err.message}`))
	}
}

async function getArgs() {
	const args = minimist(process.argv.slice(2))

	const redirectsFileArg: string | undefined = args['redirectsFile']
	const baseUrlArg: string | undefined = args['baseUrl']

	if (args.length === 0) {
		throw new Error('Missing arguments. Pass in a redirectsFile and baseUrl')
	}

	// make sure args are passed & valid
	if (redirectsFileArg == null) {
		throw new Error('Missing redirectsFile argument')
	}

	if (baseUrlArg == null) {
		throw new Error('Missing baseUrl argument')
	}

	let baseUrl = baseUrlArg.match(
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
	)?.[0]

	if (baseUrl == null) {
		throw new Error('baseUrl is not a valid URL')
	}

	//  prevent extra slash
	if (baseUrl.slice(-1) === '/') {
		baseUrl = baseUrl.slice(0, -1)
	}

	// make sure the file type & contents look ok
	const redirectsFile = path.normalize(redirectsFileArg)
	const extname = path.extname(redirectsFileArg)

	if (extname !== '.json') {
		throw new Error('redirectsFile should be in JSON format')
	}

	fs.stat(redirectsFile, (err, stats) => {
		if (err) {
			throw new Error(err.message)
		}

		if (!stats.isFile()) {
			throw new Error('requiredFile is not a file')
		}

		if (stats.size === 0) {
			throw new Error('requiredFile is empty')
		}
	})

	return { redirectsFile, baseUrl }
}

main()
