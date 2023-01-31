import { $, path } from 'zx'
import dotenv from './dotenv.js'
import once from './once.js'
import requiredEnv from './required-env.js'

const initGitBash = () => once.init('git-bash', async () => {
    $.shell = path.join(await requiredEnv('PATH_GIT'), 'bin', 'bash')
})

export default {
    init: async ({ useGitBash = false, verbose = false, readDotenv = true }) => {
        $.cwd = __dirname

        if (readDotenv === true) await dotenv.read()
        if (useGitBash === true) await initGitBash()

        $.verbose = verbose
    }
}