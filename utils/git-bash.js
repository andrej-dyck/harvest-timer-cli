import { $, path } from 'zx'
import requiredEnv from './required-env.js'

const functions = {
    useGitBash: async () => {
        $.shell = path.join(await requiredEnv('PATH_GIT'), 'bin', 'bash')
    },
    scriptWorkDir: () => {
        $.cwd = __dirname
    }
}

export default {
    ...functions,
    init: async ({ verbose } = { verbose: false }) => {
        functions.scriptWorkDir()
        await functions.useGitBash()
        $.verbose = verbose
    }
}