#! /usr/bin/env node

import { $, path, which } from 'zx'
import bash from './utils/git-bash.js'
import prompt from "./utils/prompt.js";

await bash.init()
console.log(await which('git'))

const thisScript = path.basename(__filename)
const scripts = (await $`ls *.js | grep -v ${thisScript}`)
    .stdout.trim().split('\n')

const { script } = await prompt.ask(
    prompt.question.select({
        name: 'script',
        message: '🚀 execute script',
        choices: scripts
    })

)
await $`zx ${script}`.pipe(process.stdout)