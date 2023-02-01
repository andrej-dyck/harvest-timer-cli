import { $ } from 'zx'
import dotenv from './dotenv.js'

export default {
    init: async ({ verbose = false, readDotenv = true }) => {
        $.cwd = __dirname // set workdir to where the script is
        $.verbose = verbose

        if (readDotenv === true) await dotenv.read()
    }
}