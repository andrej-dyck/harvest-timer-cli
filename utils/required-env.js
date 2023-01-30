import { $, chalk } from 'zx'

const require = async (key) => $.env[key] ?? await exitWithMissingKey(key)

const exitWithMissingKey = async (key, exitCode = 1) => {
    console.log(chalk.red(`expected value for ${key} in environment vars`))
    await $`exit ${exitCode}`
}

export default require
